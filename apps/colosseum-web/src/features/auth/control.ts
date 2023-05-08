import { onAuthStateChanged, signInWithPopup, signOut as _signOut } from "firebase/auth";
import { createEffect, createSignal, onCleanup } from "solid-js";

import { auth, authProviders } from "~/services/firebase";

export const authUser = () => {
  // TODO handle while loading
  const [user, setUser] = createSignal(auth.currentUser);

  function sync() {
    const unsubscribe = onAuthStateChanged(auth, _user => setUser(_user));
    onCleanup(unsubscribe);
  }

  function debug() {
    const cur = user();
    if (!cur) {
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
