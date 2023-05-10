import { onAuthStateChanged, signInWithPopup, signOut as _signOut, User } from "firebase/auth";
import { createEffect, createSignal, onCleanup } from "solid-js";

import { auth, authProviders } from "~/services/firebase";

export const authUser = () => {
  // TODO handle while loading
  const [user, setUser] = createSignal<{
    loading: boolean;
    value: User | null;
  }>({ loading: true, value: null });

  function sync() {
    const unsubscribe = onAuthStateChanged(auth, _user => setUser({
      loading: false,
      value: _user,
    }));
    onCleanup(unsubscribe);
  }

  function debug() {
    const cur = user();
    if (cur.loading) {
      return;
    }
    if (!cur.value) {
      console.debug("No user signed in.");
    } else {
      console.debug("User signed in:", cur);
    }
  }

  createEffect(sync);
  createEffect(debug);

  return user;
};

export const signInWithGithub = () =>
  signInWithPopup(auth, authProviders.github)
    .catch(e => {
      console.error(e);
    });

export const signOut = () =>
  _signOut(auth)
