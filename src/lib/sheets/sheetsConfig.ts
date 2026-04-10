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
 // CAJAS
  {
    category: "cajas",
    docId: "1g0ZKFSPYi30P9DFfwPSvTIFtt-5kM1ZuOUqvxbyKfcM",
    gid: "1169240357",
  },

  // CINTAS
  {
    category: "cintas",
    docId: "1RxaXXw8jRmwmMvky_nJP8IbgdmqezkXInS2WcnNKlVk",
    gid: "1583553647",
  },

  // GLOBOS
  {
    category: "globos",
    docId: "17-KL3wegV3DQolFBukLiFen5Co0_Q7lgAHXwE0U5dNI",
    gid: "1169240357",
  },

  // ACCESORIOS
  {
    category: "accesorios",
    docId: "1WDA6BzHWzeD57YJWKGD0SGzXDDcKvRXLU1lrXOJU-JE",
    gid: "1381335916",
  },

  // HOTWHEELS
  {
    category: "hotwheels",
    docId: "1maHH-C8kYc5GyKeg4O0kxKWtxFLb6Pz5GbxkV6w-E_8",
    gid: "465428229",
  },
] as const;

export type SheetSource = (typeof SHEETS_CONFIG)[number];
export type SheetCategory = SheetSource["category"];