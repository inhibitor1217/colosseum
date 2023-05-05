import {
  type APIGatewayProxyEventV2,
  type APIGatewayProxyHandlerV2,
} from "aws-lambda";
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

const parseGithubWebhookPayload = (
  event: APIGatewayProxyEventV2
): [any, boolean] => {
  if (!event.body) {
    return [null, false];
  }

  try {
    const webhook = JSON.parse(event.body);
    webhook.event =
      event.headers["X-Github-Event"] ||
      event.headers["X-GitHub-Event"] ||
      "unknown";
    return [webhook, true];
  } catch (e) {
    return [null, false];
  }
};

const verifyGithubWebhookPayload = (event: APIGatewayProxyEventV2): boolean => {
  if (!event.body) {
    return false;
  }

  const signature = event.headers["X-Hub-Signature-256"];
  if (!signature) {
    return false;
  }

  const sig = Buffer.from(signature, "utf8");
  const hmac = crypto.createHmac("sha256", githubOptions.webhook.secret);
  const digest = Buffer.from(
    "sha256=" + hmac.update(event.body).digest("hex"),
    "utf8"
  );
  return crypto.timingSafeEqual(digest, sig);
};

const logWebhook = (webhook: any): Promise<string> => {
  const timestamp = Date.now();
  const expireAt = timestamp + 1000 * 60 * 60 * 24 * 90; // 90 days

  return firestore
    .collection("github_webhooks")
    .add({
      ...webhook,
      timestamp: new Date(timestamp),
      expire_at: new Date(expireAt),
    })
    .then((res) => res.id);
};

export const webhook: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  if (!verifyGithubWebhookPayload(event)) {
    return badRequest;
  }

  const [webhook, pass] = parseGithubWebhookPayload(event);

  if (!pass) {
    return badRequest;
  }

  const docId = await logWebhook(webhook);
  console.log({ docId });

  return ok;
};
