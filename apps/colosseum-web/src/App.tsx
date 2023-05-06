import {
  aggregateScores,
  rules,
  scoreOfRuleInThisMonth,
  stubScores,
} from "~/features/github-webhook";
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
  const aggregated = stubScores();
  // [
  //   rules.issueOpen,
  //   rules.issueCompleted,
  //   rules.issueComment,
  //   rules.pullRequestOpen,
  //   rules.pullRequestClose,
  //   rules.pullRequestMerge,
  //   rules.pullRequestApprove,
  //   rules.pullRequestReview,
  // ]
  //   .map(rule => scoreOfRuleInThisMonth(ARENA, USER, rule)(firestore))

  return (
    <h1 class="text-3xl">
      {(() => {
        const result = aggregated();
        if (!result) return "Loading...";
        const [score, timestamp] = result;
        return `${score} (${new Date(timestamp).toLocaleString()})`;
      })()}
    </h1>
  );
};

export default App;
