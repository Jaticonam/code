export const SHEETS_CONFIG = [
  {
    category: "flores",
    docId: "14HvNWxOltXtr3NUKXUpbK0ah5DG-atKz7UqTkq-p5lk",
    gid: "999826345",
  },
  {
    category: "peluches",
    docId: "1-LdkBcXRDBIAkVOjQ2QLusgqKmGjAOAZeyO7C8_TIow",
    gid: "849795903",
  },
  {
    category: "papeles",
    docId: "1Y19zwLoqf2x6FFyrQJSYZFfldFWNOpZe0EdrLl6tsuM",
    gid: "1583553647",
  },
] as const;

export type SheetSource = (typeof SHEETS_CONFIG)[number];
export type SheetCategory = SheetSource["category"];