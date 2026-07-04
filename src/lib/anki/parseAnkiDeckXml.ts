import { v4 as uuidV4 } from "uuid";
import { ParsedAnkiDeck } from "./ankiImport.types";
import { htmlToPlainText, parseAnkiTagsToFolderPath, splitBackVariants } from "./htmlToPlainText";
import { resolveAnkiFields } from "./resolveAnkiFields";

function readFieldValue(cardEl: Element, fieldName: string): string {
  const fieldEl = Array.from(cardEl.querySelectorAll(":scope > rich-text")).find(
    (node) => node.getAttribute("name") === fieldName
  );

  if (!fieldEl) return "";
  return htmlToPlainText(fieldEl.innerHTML);
}

export function parseAnkiDeckXml(xml: string, sourceName?: string): ParsedAnkiDeck {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error(`Invalid Anki XML${sourceName ? ` in ${sourceName}` : ""}`);
  }

  const deckEl = doc.querySelector("deck");
  if (!deckEl) {
    throw new Error(`No <deck> element found${sourceName ? ` in ${sourceName}` : ""}`);
  }

  const title = deckEl.getAttribute("name")?.trim() || sourceName || "Imported deck";
  const tags = deckEl.getAttribute("tags")?.trim() || "";
  const folderPath = parseAnkiTagsToFolderPath(tags);

  const fieldNames = Array.from(deckEl.querySelectorAll("fields > rich-text"))
    .map((node) => node.getAttribute("name")?.trim() || "")
    .filter(Boolean);

  const cardNodes = Array.from(deckEl.querySelectorAll("cards > card"));
  const { frontField, backField, exampleFields } = resolveAnkiFields(fieldNames);

  if (!frontField || !backField) {
    throw new Error(
      `Could not detect front/back fields in "${title}". Fields: ${fieldNames.join(", ")}`
    );
  }

  const cards = cardNodes
    .map((cardEl) => {
      const frontText = readFieldValue(cardEl, frontField);
      const backText = readFieldValue(cardEl, backField);

      if (!frontText || !backText) {
        return null;
      }

      const examples = exampleFields
        .map((fieldName) => readFieldValue(cardEl, fieldName))
        .map((value) => value.trim())
        .filter(Boolean);

      return {
        front: [frontText],
        back: splitBackVariants(backText),
        examples: [...new Set(examples)],
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  if (!cards.length) {
    throw new Error(`Deck "${title}" has no valid cards`);
  }

  return {
    clientId: uuidV4(),
    title,
    tags,
    folderPath,
    fieldNames,
    frontField,
    backField,
    exampleFields,
    cards,
  };
}
