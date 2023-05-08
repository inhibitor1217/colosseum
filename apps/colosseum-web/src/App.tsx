import { Show } from "solid-js";

import { authUser } from "~/features/auth";
import { PageLayout } from "~/layout";
import Score from "~/pages/Score";
import SignIn from "~/pages/SignIn";

const App = () => {
  const user = authUser();

  const signed = () => !!user();
  const unsigned = () => !user();

  return (
    <PageLayout>
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
