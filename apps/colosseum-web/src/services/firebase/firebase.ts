import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "~/config/firebase";

export const firebase = initializeApp(firebaseConfig);

export const auth = getAuth();
export const authProviders = {
  github: new GithubAuthProvider(),
};

export const firestore = getFirestore(firebase);
