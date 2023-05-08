import { signInWithPopup } from "firebase/auth";

import { auth, authProviders } from "~/services/firebase";

export const signInWithGithub = () =>
  signInWithPopup(auth, authProviders.github)
    .then(result => {
      console.log(result.providerId, result.user);
    })
    .catch(e => {
      console.error(e);
    });
