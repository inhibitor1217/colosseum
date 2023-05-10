import { Show } from "solid-js";

import Spinner from "~/components/Spinner";
import { authUser } from "~/features/auth";
import { PageLayout } from "~/layout";
import Score from "~/pages/Score";
import SignIn from "~/pages/SignIn";

const App = () => {
  const user = authUser();

  const loading = () => {
    const u = user();
    return u.loading;
  };
  const signed = () => {
    const u = user();
    return !u.loading && u.value;
  };
  const unsigned = () => {
    const u = user();
    return !u.loading && !u.value;
  };

  return (
    <PageLayout>
      <Show when={loading()}>
        <Spinner />
      </Show>
      <Show when={signed()}>
        <Score />
      </Show>
      <Show when={unsigned()}>
        <SignIn />
      </Show>
    </PageLayout>
  )
};

export default App;
