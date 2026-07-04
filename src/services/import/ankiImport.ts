import { api, handleApiRequest } from "@/lib/axios";
import {
  ImportJobCreateResponse,
  ImportJobPayload,
  ImportJobStatusResponse,
  ImportPreviewResponse,
  ParsedAnkiDeck,
} from "@/lib/anki/ankiImport.types";
import {
  ANKI_IMPORT_CREATE_JOB_API,
  ANKI_IMPORT_GET_JOB_API,
  ANKI_IMPORT_PREVIEW_API,
} from "@/routes/api";

export async function previewAnkiImportRequest(
  desks: ParsedAnkiDeck[],
  token: string
): Promise<ImportPreviewResponse> {
  return handleApiRequest(
    api.post(ANKI_IMPORT_PREVIEW_API, { desks }, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function createAnkiImportJobRequest(
  payload: ImportJobPayload,
  token: string
): Promise<ImportJobCreateResponse> {
  return handleApiRequest(
    api.post(ANKI_IMPORT_CREATE_JOB_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getAnkiImportJobRequest(
  jobSub: string,
  token: string
): Promise<ImportJobStatusResponse> {
  return handleApiRequest(
    api.get(ANKI_IMPORT_GET_JOB_API(jobSub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}
