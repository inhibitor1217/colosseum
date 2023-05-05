import { type APIGatewayProxyHandlerV2 } from "aws-lambda";
import crypto from "crypto";
import { initializeApp as initializeFirebaseApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { firebaseOptions } from "./config/firebase";
import { githubOptions } from "./config/github";

const firebase = initializeFirebaseApp(firebaseOptions);
const firestore = getFirestore(firebase);

const ok = {
  statusCode: 200,
  body: "OK",
};

const badRequest = {
  statusCode: 400,
  body: "Bad Request",
};

const parseGithubWebhookPayload = (body: string): [any, boolean] => {
  try {
    return [JSON.parse(body), true];
  } catch (e) {
    return [null, false];
  }
};

const verifyGithubWebhookPayload = (
  body: string,
  signature: string
): boolean => {
  const sig = Buffer.from(signature, "utf8");
  const hmac = crypto.createHmac("sha256", githubOptions.webhook.secret);
  const digest = Buffer.from(
    "sha256=" + hmac.update(body).digest("hex"),
    "utf8"
  );
  return crypto.timingSafeEqual(digest, sig);
};

export const webhook: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  if (!event.body) {
    return badRequest;
  }

  const signature = event.headers["X-Hub-Signature-256"];
  if (!signature) {
    return badRequest;
  }

  if (!verifyGithubWebhookPayload(event.body, signature)) {
    return badRequest;
  }

  const [webhook, pass] = parseGithubWebhookPayload(event.body);

  if (!pass) {
    return badRequest;
  }

  console.log(webhook);

  return ok;
};
