const FRONT_FIELD_PATTERN =
  /^(front|question|word|term|expression|phrase|vocabulary)$/i;
const BACK_FIELD_PATTERN =
  /^(back|answer|translation|definition|meaning|reverse)$/i;
const EXAMPLE_FIELD_PATTERN =
  /^(context|example|sentence|sample|usage|note|notes|hint|examples?)$/i;

export interface ResolvedAnkiFields {
  frontField: string;
  backField: string;
  exampleFields: string[];
}

export function resolveAnkiFields(fieldNames: string[]): ResolvedAnkiFields {
  const uniqueNames = [...new Set(fieldNames.filter(Boolean))];

  let frontField =
    uniqueNames.find((name) => FRONT_FIELD_PATTERN.test(name)) ?? "";
  let backField = uniqueNames.find((name) => BACK_FIELD_PATTERN.test(name)) ?? "";

  if (!frontField && uniqueNames.length > 0) {
    frontField = uniqueNames.find((name) => name !== backField) ?? uniqueNames[0];
  }

  if (!backField && uniqueNames.length > 1) {
    backField =
      uniqueNames.find((name) => name !== frontField) ?? uniqueNames[1] ?? "";
  }

  const exampleFields = uniqueNames.filter((name) => {
    if (name === frontField || name === backField) return false;
    return true;
  });

  const prioritizedExamples = [
    ...exampleFields.filter((name) => EXAMPLE_FIELD_PATTERN.test(name)),
    ...exampleFields.filter((name) => !EXAMPLE_FIELD_PATTERN.test(name)),
  ];

  return {
    frontField,
    backField,
    exampleFields: [...new Set(prioritizedExamples)],
  };
}
