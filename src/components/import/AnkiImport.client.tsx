
import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Header from "@/components/layout/Header";
import WithBottomNav from "@/components/layout/WithBottomNav";
import { useNavigate } from "react-router-dom";
import { parseAnkiZipFiles } from "@/lib/anki/parseAnkiZip";
import {
  DeskImportStrategy,
  ImportJobPayload,
  ImportPreviewDeskResult,
  ParsedAnkiDeck,
} from "@/lib/anki/ankiImport.types";
import { useAuthContext } from "@/context/AuthContext";
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

const STRATEGY_LABELS: Record<DeskImportStrategy, string> = {
  merge: "Merge",
  skip: "Skip",
  replace: "Replace",
  rename: "Rename",
};

function formatFolderPath(path: string[]) {
  return path.length ? path.join(" › ") : "Home";
}

export default function AnkiImportClient() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuthContext();
  const { call } = useProtectedRequest();
  const { notifySuccess, notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("upload");
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState({ current: 0, total: 0 });
  const [parsedDesks, setParsedDesks] = useState<ParsedAnkiDeck[]>([]);
  const [previewDesks, setPreviewDesks] = useState<ImportPreviewDeskResult[]>([]);
  const [defaultStrategy, setDefaultStrategy] = useState<DeskImportStrategy>("merge");
  const [deskStrategies, setDeskStrategies] = useState<Record<string, DeskImportStrategy>>({});
  const [importProgress, setImportProgress] = useState({ progress: 0, total: 0 });
  const [importSummary, setImportSummary] = useState<string>("");

  const totalCards = useMemo(
    () => parsedDesks.reduce((sum, desk) => sum + desk.cards.length, 0),
    [parsedDesks]
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

      const initialStrategies = Object.fromEntries(
        preview.desks.map((desk) => [desk.clientId, defaultStrategy])
      );
      setDeskStrategies(initialStrategies);
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
    const pollIntervalMs = 1000;

    while (true) {
      const status = await call((token) => getAnkiImportJobRequest(jobSub, token));
      setImportProgress({ progress: status.progress, total: status.total });

      if (status.status === "completed" && status.result) {
        const { summary } = status.result;
        setImportSummary(
          `Created ${summary.desksCreated}, merged ${summary.desksMerged}, skipped ${summary.desksSkipped}. Added ${summary.cardsAdded} cards, ${summary.examplesAdded} examples.`
        );
        setStep("done");
        queryClient.invalidateQueries({ queryKey: [USER_DESKS] });
        queryClient.invalidateQueries({ queryKey: [ROOT_FOLDERS] });
        notifySuccess("Anki import completed");
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
        defaultStrategy,
        languageSettings: DEFAULT_DESK_LANGUAGE_SETTINGS,
        desks: parsedDesks.map((desk) => ({
          ...desk,
          strategy: deskStrategies[desk.clientId] ?? defaultStrategy,
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
                Upload Anki exports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export decks from Anki Desktop as .zip files. We parse the XML inside,
                map tags like <code>Topics::2026</code> to folders, and import Context /
                other extra fields as example sentences — Gemini is not used during import.
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
                startIcon={isParsing ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
                disabled={isParsing}
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsing ? "Parsing..." : "Select Anki .zip files"}
              </Button>

              {isParsing && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Parsing file {parseProgress.current} of {parseProgress.total}
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
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Preview import
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {previewDesks.length} decks, {totalCards} cards ready to import.
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Default conflict strategy</InputLabel>
                  <Select
                    label="Default conflict strategy"
                    value={defaultStrategy}
                    onChange={(event) =>
                      setDefaultStrategy(event.target.value as DeskImportStrategy)
                    }
                  >
                    {Object.entries(STRATEGY_LABELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            {previewDesks.map((desk) => (
              <Card key={desk.clientId}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight={700}>{desk.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFolderPath(desk.folderPath)} · {desk.cardCount} cards ·{" "}
                        {desk.exampleCount} examples
                      </Typography>
                    </Box>
                    {desk.conflict && <Chip size="small" color="warning" label="Exists" />}
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    Fields: front={desk.frontField}, back={desk.backField}
                    {desk.exampleFields.length
                      ? `, examples=[${desk.exampleFields.join(", ")}]`
                      : ""}
                  </Typography>

                  {desk.conflict && (
                    <Typography variant="caption" color="text.secondary">
                      Existing deck at {desk.existingLocationLabel}. Estimated{" "}
                      {desk.estimatedNewCards} new, {desk.estimatedDuplicateCards} duplicates.
                    </Typography>
                  )}

                  <FormControl fullWidth size="small">
                    <InputLabel>Strategy</InputLabel>
                    <Select
                      label="Strategy"
                      value={deskStrategies[desk.clientId] ?? defaultStrategy}
                      onChange={(event) =>
                        setDeskStrategies((prev) => ({
                          ...prev,
                          [desk.clientId]: event.target.value as DeskImportStrategy,
                        }))
                      }
                    >
                      {Object.entries(STRATEGY_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            ))}

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button variant="contained" onClick={() => void handleImport()}>
                Start import
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
                {importProgress.progress} / {importProgress.total} cards processed
              </Typography>
              <LinearProgress
                variant={
                  importProgress.total > 0 ? "determinate" : "indeterminate"
                }
                value={
                  importProgress.total > 0
                    ? (importProgress.progress / importProgress.total) * 100
                    : 0
                }
              />
            </CardContent>
          </Card>
        )}

        {step === "done" && (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Import complete
              </Typography>
              <Typography variant="body2">{importSummary}</Typography>
              <Divider />
              <Button variant="contained" onClick={() => navigate("/home")}>
                Go to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </WithBottomNav>
  );
}
