import { type APIGatewayProxyHandlerV2 } from "aws-lambda";
import { initializeApp as initializeFirebaseApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { firebaseOptions } from "./config/firebase";

const firebase = initializeFirebaseApp(firebaseOptions);
const firestore = getFirestore(firebase);

export const webhook: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msg: "ok",
    }),
  };
};
