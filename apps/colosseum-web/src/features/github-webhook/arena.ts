export type Arena =
  | { type: "repository"; id: number }
  | { type: "organization"; id: number };
