import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "~/config/firebase";

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);