import JSZip from "jszip";
import { ParsedAnkiDeck } from "./ankiImport.types";
import { parseAnkiDeckXml } from "./parseAnkiDeckXml";

async function extractXmlFromZip(zip: JSZip): Promise<{ name: string; content: string }> {
  const xmlFiles = Object.keys(zip.files).filter((path) => {
    const entry = zip.files[path];
    return !entry.dir && path.toLowerCase().endsWith(".xml");
  });

  if (!xmlFiles.length) {
    throw new Error("No XML file found inside Anki export zip");
  }

  const xmlPath = xmlFiles[0];
  const content = await zip.files[xmlPath].async("string");

  return {
    name: xmlPath.split("/").pop() ?? xmlPath,
    content,
  };
}

export async function parseAnkiZipFile(file: File): Promise<ParsedAnkiDeck> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".xml")) {
    const content = await file.text();
    return parseAnkiDeckXml(content, file.name);
  }

  if (!lowerName.endsWith(".zip")) {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const { name, content } = await extractXmlFromZip(zip);

  return parseAnkiDeckXml(content, name);
}

export async function parseAnkiZipFiles(files: File[]): Promise<ParsedAnkiDeck[]> {
  const results: ParsedAnkiDeck[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const deck = await parseAnkiZipFile(file);
      results.push(deck);
    } catch (error) {
      errors.push(
        `${file.name}: ${error instanceof Error ? error.message : "Failed to parse"}`
      );
    }
  }

  if (!results.length) {
    throw new Error(errors.join("\n") || "No decks could be parsed");
  }

  if (errors.length) {
    console.warn("Anki import parse warnings:", errors);
  }

  return results;
}
