export type Arena =
  | { type: "repository"; fullName: string }
  | { type: "organization"; login: string };
