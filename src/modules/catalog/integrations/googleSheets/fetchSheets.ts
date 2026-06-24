export type CsvRow = Record<string, string>;

export interface GoogleSheetSource {
  docId: string;
  gid: string;
  name?: string;
  category?: string;
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

export function parseCSV(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (!lines.length) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.trim().toLowerCase(),
  );

  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });

    return row;
  });

  return { headers, rows };
}

export function validateSheetHeaders(
  headers: string[],
  requiredHeaders: readonly string[],
  source: GoogleSheetSource,
) {
  const normalizedHeaders = headers.map((header) =>
    header.trim().toLowerCase(),
  );

  const missing = requiredHeaders.filter(
    (required) => !normalizedHeaders.includes(required.toLowerCase()),
  );

  if (!missing.length) return;

  const label = source.category || source.name || "Google Sheet";

  throw new Error(
    `La hoja "${label}" docId="${source.docId}" gid="${source.gid}" no cumple el schema. Faltan columnas: ${missing.join(", ")}`,
  );
}

export async function fetchSheetRows(
  source: GoogleSheetSource,
  requiredHeaders: readonly string[],
): Promise<CsvRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${source.docId}/export?format=csv&gid=${source.gid}`;

  const response = await fetch(url);

  if (!response.ok) {
    const label = source.category || source.name || "Google Sheet";

    throw new Error(
      `Error cargando "${label}" docId="${source.docId}" gid="${source.gid}": HTTP ${response.status}`,
    );
  }

  const csvText = await response.text();
  const { headers, rows } = parseCSV(csvText);

  validateSheetHeaders(headers, requiredHeaders, source);

  return rows.filter((row) =>
    Object.values(row).some((value) => (value ?? "").trim() !== ""),
  );
}
