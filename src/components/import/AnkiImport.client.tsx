
import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { useNavigate } from "react-router-dom";
import { parseAnkiZipFiles } from "@/lib/anki/parseAnkiZip";
import {
  ImportJobPayload,
  ImportPreviewDeskResult,
  ParsedAnkiDeck,
} from "@/lib/anki/ankiImport.types";
import { useProtectedRequest } from "@/utils/protected";
import {
  createAnkiImportJobRequest,
  getAnkiImportJobRequest,
  previewAnkiImportRequest,
} from "@/services/import/ankiImport";
import { useNotification } from "@/context/NotificationContext";
import { DEFAULT_DESK_LANGUAGE_SETTINGS } from "@/constants/language.const";
import { useQueryClient } from "@tanstack/react-query";
import { ROOT_FOLDERS, USER_DESKS } from "@/routes/react-query";

type Step = "upload" | "preview" | "importing" | "done";

const IMPORT_STRATEGY = "merge" as const;

function formatFolderPath(path: string[]) {
  return path.length ? path.join(" › ") : "Home";
}

function describeDeskAction(desk: ImportPreviewDeskResult) {
  if (!desk.conflict) {
    return "New deck";
  }

  if (desk.estimatedNewCards === 0) {
    return "Already imported — nothing new";
  }

  return `Add ${desk.estimatedNewCards} new card${desk.estimatedNewCards === 1 ? "" : "s"}`;
}

export default function AnkiImportClient() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { call } = useProtectedRequest();
  const { notifySuccess, notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("upload");
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState({ current: 0, total: 0 });
  const [parsedDesks, setParsedDesks] = useState<ParsedAnkiDeck[]>([]);
  const [previewDesks, setPreviewDesks] = useState<ImportPreviewDeskResult[]>([]);
  const [importProgress, setImportProgress] = useState({ progress: 0, total: 0 });
  const [importSummary, setImportSummary] = useState("");

  const totalCards = useMemo(
    () => parsedDesks.reduce((sum, desk) => sum + desk.cards.length, 0),
    [parsedDesks]
  );

  const totalNewCards = useMemo(
    () => previewDesks.reduce((sum, desk) => sum + desk.estimatedNewCards, 0),
    [previewDesks]
  );

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsParsing(true);
    setParseProgress({ current: 0, total: files.length });

    try {
      const fileArray = Array.from(files);
      const decks: ParsedAnkiDeck[] = [];

      for (let index = 0; index < fileArray.length; index += 1) {
        setParseProgress({ current: index + 1, total: fileArray.length });
        const batch = await parseAnkiZipFiles([fileArray[index]]);
        decks.push(...batch);
      }

      setParsedDesks(decks);

      const preview = await call((token) => previewAnkiImportRequest(decks, token));
      setPreviewDesks(preview.desks);
      setStep("preview");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to parse Anki export");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const pollJob = async (jobSub: string) => {
    const pollIntervalMs = 400;

    while (true) {
      const status = await call((token) => getAnkiImportJobRequest(jobSub, token));
      setImportProgress({ progress: status.progress, total: status.total });

      if (status.status === "completed" && status.result) {
        const { summary } = status.result;
        const parts: string[] = [];

        if (summary.desksCreated > 0) {
          parts.push(
            `${summary.desksCreated} new deck${summary.desksCreated === 1 ? "" : "s"}`
          );
        }
        if (summary.desksMerged > 0) {
          parts.push(
            `${summary.desksMerged} existing deck${summary.desksMerged === 1 ? "" : "s"} updated`
          );
        }
        if (summary.cardsAdded > 0) {
          parts.push(`${summary.cardsAdded} cards added`);
        }
        if (summary.cardsSkipped > 0) {
          parts.push(`${summary.cardsSkipped} duplicates skipped`);
        }

        setImportSummary(parts.length ? parts.join(" · ") : "Nothing new to import");
        setStep("done");
        queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
        queryClient.invalidateQueries({ queryKey: [ROOT_FOLDERS] });
        notifySuccess("Import finished");
        return;
      }

      if (status.status === "failed") {
        throw new Error(status.errorMessage || "Import failed");
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  };

  const handleImport = async () => {
    if (!parsedDesks.length) return;

    setStep("importing");

    try {
      const payload: ImportJobPayload = {
        defaultStrategy: IMPORT_STRATEGY,
        languageSettings: DEFAULT_DESK_LANGUAGE_SETTINGS,
        desks: parsedDesks.map((desk) => ({
          ...desk,
          strategy: IMPORT_STRATEGY,
        })),
      };

      const job = await call((token) => createAnkiImportJobRequest(payload, token));
      setImportProgress({ progress: job.progress, total: job.total });
      await pollJob(job.sub);
    } catch (error) {
      setStep("preview");
      notifyError(error instanceof Error ? error.message : "Import failed");
    }
  };

  return (
    <WithBottomNav>
      <Header title="Import from Anki" onBack={() => navigate(-1)} />

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {step === "upload" && (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Import decks from Anki
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Anki Desktop, export your deck as a .zip file, then upload it here.
                You can select several files at once.
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.xml,application/zip,text/xml"
                multiple
                hidden
                onChange={(event) => void handleFilesSelected(event.target.files)}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={
                  isParsing ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <UploadFileIcon />
                  )
                }
                disabled={isParsing}
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsing ? "Reading files..." : "Choose .zip files"}
              </Button>

              {isParsing && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File {parseProgress.current} of {parseProgress.total}
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {step === "preview" && (
          <>
            <Card>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="h6" fontWeight={600}>
                  Ready to import
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {previewDesks.length} deck{previewDesks.length === 1 ? "" : "s"},{" "}
                  {totalCards} card{totalCards === 1 ? "" : "s"} total
                  {totalNewCards < totalCards
                    ? ` (${totalNewCards} new)`
                    : ""}
                  .
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If a deck already exists, only new cards are added. Duplicates are
                  skipped automatically.
                </Typography>
              </CardContent>
            </Card>

            {previewDesks.map((desk) => (
              <Card key={desk.clientId} variant="outlined">
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                  >
                    <Box>
                      <Typography fontWeight={600}>{desk.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFolderPath(desk.folderPath)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {desk.cardCount} cards
                        {desk.exampleCount > 0
                          ? ` · ${desk.exampleCount} with examples`
                          : ""}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "right", flexShrink: 0, maxWidth: "45%" }}
                    >
                      {describeDeskAction(desk)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setStep("upload")}>
                Choose other files
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={totalNewCards === 0}
                onClick={() => void handleImport()}
              >
                {totalNewCards === 0 ? "Nothing new to import" : "Import"}
              </Button>
            </Stack>
          </>
        )}

        {step === "importing" && (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Importing...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {importProgress.total > 0
                  ? `${importProgress.progress} / ${importProgress.total} cards`
                  : "Starting import..."}
              </Typography>
              <LinearProgress
                variant={
                  importProgress.total > 0 && importProgress.progress > 0
                    ? "determinate"
                    : "indeterminate"
                }
                value={
                  importProgress.total > 0
                    ? (importProgress.progress / importProgress.total) * 100
                    : undefined
                }
              />
            </CardContent>
          </Card>
        )}

        {step === "done" && (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Done
              </Typography>
              <Typography variant="body2">{importSummary}</Typography>
              <Divider />
              <Button variant="contained" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </WithBottomNav>
  );
}
