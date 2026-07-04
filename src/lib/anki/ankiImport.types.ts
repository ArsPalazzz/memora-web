export interface ParsedAnkiCard {
  front: string[];
  back: string[];
  examples: string[];
}

export interface ParsedAnkiDeck {
  clientId: string;
  title: string;
  tags: string;
  folderPath: string[];
  fieldNames: string[];
  frontField: string;
  backField: string;
  exampleFields: string[];
  cards: ParsedAnkiCard[];
}

export type DeskImportStrategy = "merge" | "skip" | "replace" | "rename";

export interface ImportPreviewDeskResult {
  clientId: string;
  title: string;
  tags: string;
  folderPath: string[];
  fieldNames: string[];
  frontField: string;
  backField: string;
  exampleFields: string[];
  cardCount: number;
  exampleCount: number;
  conflict: boolean;
  existingDeskSub: string | null;
  existingLocationLabel: string | null;
  estimatedNewCards: number;
  estimatedDuplicateCards: number;
}

export interface ImportPreviewResponse {
  desks: ImportPreviewDeskResult[];
  totalCards: number;
}

export interface ImportJobCreateResponse {
  sub: string;
  status: string;
  progress: number;
  total: number;
  createdAt: string;
}

export interface ImportJobStatusResponse {
  sub: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  total: number;
  result: {
    desks: Array<{
      clientId: string;
      title: string;
      deskSub: string | null;
      strategy: DeskImportStrategy;
      created: boolean;
      skipped: boolean;
      cardsAdded: number;
      cardsSkipped: number;
      examplesAdded: number;
    }>;
    summary: {
      desksCreated: number;
      desksMerged: number;
      desksSkipped: number;
      cardsAdded: number;
      cardsSkipped: number;
      examplesAdded: number;
    };
  } | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImportJobPayload {
  defaultStrategy: DeskImportStrategy;
  languageSettings: {
    front_language: string;
    back_language: string;
    example_language: string;
  };
  desks: Array<ParsedAnkiDeck & { strategy?: DeskImportStrategy; renameTitle?: string }>;
}
