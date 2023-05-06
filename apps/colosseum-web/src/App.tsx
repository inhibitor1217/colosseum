import { rules, scoreOfRuleInThisMonth } from "~/features/github-webhook";
import { firestore } from "~/services/firebase";

const ARENA = {
  type: "repository" as const,
  fullName: "inhibitor1217/colosseum",
};

const USER = {
  type: "user" as const,
  login: "inhibitor1217",
};

const App = () => {
  const issueOpenScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.issueOpen
  )(firestore);
  const issueCompletedScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.issueCompleted
  )(firestore);
  const issueCommentScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.issueComment
  )(firestore);
  const pullRequestOpenScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.pullRequestOpen
  )(firestore);
  const pullRequestsCloseScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.pullRequestClose
  )(firestore);
  const pullRequestMergeScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.pullRequestMerge
  )(firestore);
  const pullRequestApproveScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.pullRequestApprove
  )(firestore);
  const pullRequestReviewScore = scoreOfRuleInThisMonth(
    ARENA,
    USER,
    rules.pullRequestReview
  )(firestore);

  return (
    <h1 class="text-3xl">
      issue open score = {issueOpenScore()}
      <br />
      issue completed score = {issueCompletedScore()}
      <br />
      issue comment score = {issueCommentScore()}
      <br />
      pull request open score = {pullRequestOpenScore()}
      <br />
      pull request close score = {pullRequestsCloseScore()}
      <br />
      pull request merge score = {pullRequestMergeScore()}
      <br />
      pull request approve score = {pullRequestApproveScore()}
      <br />
      pull request review score = {pullRequestReviewScore()}
      <br />
    </h1>
  );
};

export default App;
