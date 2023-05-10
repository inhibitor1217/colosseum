import Spinner from "~/components/Spinner";
import { signOut } from "~/features/auth";
import {
  aggregateScores,
  rules,
  scoreOfRuleInThisMonth,
} from "~/features/github-webhook";
import { firestore } from "~/services/firebase";

const ARENA = {
  type: "repository" as const,
  fullName: "inhibitor1217/colosseum",
};

const USER = {
  type: "user" as const,
  id: 25701854,
};

const Header = () => (
  <button class="btn btn-primary" onClick={signOut}>
    Sign out
  </button>
)

const Scoreboard = (props: { score: number; updatedAt: Date }) => (
  <div class="flex flex-col gap-4 items-start">
    <pre class="text-4xl">
      <p>
        <span class="text-cyan-300">score</span>
        <span class="text-white"> = </span>
        <span class="text-green-300 font-bold">{props.score}</span>
      </p>
      <p class="opacity-50">
        <span class="text-cyan-300">updated_at</span>
        <span class="text-white"> = </span>
        <span class="text-blue-500">new </span>
        <span class="text-green-500">Date</span>
        <span class="text-white">(</span>
        <span class="text-yellow-500">
          "{props.updatedAt.toLocaleString()}"
        </span>
        <span class="text-white">)</span>
      </p>
    </pre>
  </div>
);

const Score = () => {
  const aggregated = aggregateScores(
    [
      rules.issueOpen,
      rules.issueCompleted,
      rules.issueComment,
      rules.pullRequestOpen,
      rules.pullRequestClose,
      rules.pullRequestMerge,
      rules.pullRequestApprove,
      rules.pullRequestReview,
    ].map((rule) => scoreOfRuleInThisMonth(ARENA, USER, rule)(firestore))
  );

  const loading = () => !aggregated();
  const score = () => aggregated()![0];
  const updatedAt = () => new Date(aggregated()![1]);

  return (
    <>
      <Header />
      {loading() ? (
        <Spinner />
      ) : (
        <Scoreboard score={score()} updatedAt={updatedAt()} />
      )}
    </>
  );
};

export default Score;
