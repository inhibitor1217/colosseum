export type FilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";

export type Filter = [string, FilterOp, any];

export type Rule = {
  event: string;
  action: string;
  filter?: Filter[];
  score: number;
};

const issueOpen: Rule = {
  event: "issues",
  action: "opened",
  filter: [["issue.state_reason", "!=", "reopened"]],
  score: 50,
};

const issueCompleted: Rule = {
  event: "issues",
  action: "closed",
  filter: [["issue.state_reason", "==", "completed"]],
  score: 50,
};

const issueComment: Rule = {
  event: "issue_comment",
  action: "created",
  score: 20,
};

const pullRequestOpen: Rule = {
  event: "pull_request",
  action: "opened",
  score: 100,
};

const pullRequestClose: Rule = {
  event: "pull_request",
  action: "closed",
  filter: [["pull_request.merged", "==", false]],
  score: 10,
};

const pullRequestMerge: Rule = {
  event: "pull_request",
  action: "closed",
  filter: [["pull_request.merged", "==", true]],
  score: 200,
};

const pullRequestApprove: Rule = {
  event: "pull_request_review",
  action: "submitted",
  filter: [["review.state", "==", "approved"]],
  score: 50,
};

const pullRequestReview: Rule = {
  event: "pull_request_review_comment",
  action: "created",
  score: 20,
};

export const rules = {
  issueOpen,
  issueCompleted,
  issueComment,
  pullRequestOpen,
  pullRequestClose,
  pullRequestMerge,
  pullRequestApprove,
  pullRequestReview,
};
