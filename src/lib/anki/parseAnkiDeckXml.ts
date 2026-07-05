import { v4 as uuidV4 } from "uuid";
import { ParsedAnkiDeck } from "./ankiImport.types";
import { htmlToPlainText, parseAnkiTagsToFolderPath, splitBackVariants } from "./htmlToPlainText";
import { resolveAnkiFields } from "./resolveAnkiFields";
import { restoreAnkiSanitizedDeckTitle } from "./restoreAnkiDeckTitle";

function readFieldRawContent(fieldEl: Element): string {
  if (!fieldEl.childNodes.length) {
    return fieldEl.textContent?.trim() ?? "";
  }

  const serializer = new XMLSerializer();
  const serialized = Array.from(fieldEl.childNodes)
    .map((node) => serializer.serializeToString(node))
    .join("");

  const textContent = fieldEl.textContent ?? "";
  if (!serialized.trim() && textContent.trim()) {
    return textContent;
  }

  return serialized || textContent;
}

function findCardField(cardEl: Element, fieldName: string): Element | null {
  const richTextField = Array.from(cardEl.querySelectorAll(":scope > rich-text")).find(
    (node) => node.getAttribute("name") === fieldName
  );
  if (richTextField) return richTextField;

  return (
    Array.from(cardEl.querySelectorAll(":scope > field, :scope > *")).find(
      (node) => node.getAttribute("name") === fieldName
    ) ?? null
  );
}

function readFieldValue(cardEl: Element, fieldName: string): string {
  const fieldEl = findCardField(cardEl, fieldName);
  if (!fieldEl) return "";
  return htmlToPlainText(readFieldRawContent(fieldEl));
}

function readPrefixedAttribute(deckEl: Element, ...localNames: string[]): string {
  const wanted = new Set(localNames.map((name) => name.toLowerCase()));

  for (let index = 0; index < deckEl.attributes.length; index += 1) {
    const attribute = deckEl.attributes[index];
    if (!wanted.has(attribute.localName.toLowerCase())) continue;

    const value = attribute.value.trim();
    if (value) return value;
  }

  return "";
}

function readDeckChildText(deckEl: Element, tagName: string): string {
  return (
    deckEl.querySelector(`:scope > ${tagName}`)?.textContent?.trim() ?? ""
  );
}

function readDeckTitle(deckEl: Element, sourceName?: string): string {
  const originalName = readPrefixedAttribute(
    deckEl,
    "original-name",
    "originalName",
    "display-name",
    "displayName"
  );
  if (originalName) {
    return originalName;
  }

  const fromAttribute = readPrefixedAttribute(
    deckEl,
    "name",
    "title",
    "deck-name",
    "deckName"
  );
  if (fromAttribute) {
    return restoreAnkiSanitizedDeckTitle(fromAttribute);
  }

  const fromChild =
    readDeckChildText(deckEl, "name") ||
    readDeckChildText(deckEl, "title") ||
    readDeckChildText(deckEl, "deck-name");

  if (fromChild) {
    return restoreAnkiSanitizedDeckTitle(fromChild);
  }

  if (sourceName) {
    return restoreAnkiSanitizedDeckTitle(
      sourceName.replace(/\.xml$/i, "").trim()
    );
  }

  return "Imported deck";
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

  const title = readDeckTitle(deckEl, sourceName);
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
