import {
  collection,
  query,
  where,
  type Firestore,
  getCountFromServer,
  onSnapshot,
  orderBy,
  limit,
  Query,
} from "firebase/firestore";
import {
  createEffect,
  createResource,
  createSignal,
  onCleanup,
} from "solid-js";

import { type Arena } from "./arena";
import { type Rule } from "./rule";
import { type User } from "./user";

const whereMatchArena = (arena: Arena) => {
  switch (arena.type) {
    case "organization":
      return [where("organization.login", "==", arena.login)];
    case "repository":
      return [where("repository.full_name", "==", arena.fullName)];
  }
};

const whereMatchUser = (user: User) => {
  switch (user.type) {
    case "user":
      return [
        where("sender.type", "==", "User"),
        where("sender.id", "==", user.id),
      ];
  }
};

const whereMatchRule = (rule: Rule) => [
  where("event", "==", rule.event),
  where("action", "==", rule.action),
  ...(rule.filter?.map(([path, operator, value]) =>
    where(path, operator, value)
  ) ?? []),
];

const whereMatchThisMonth = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return [
    where("timestamp", ">=", monthStart),
    where("timestamp", "<", monthEnd),
  ];
};

const queryEventsOfRule =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    query(
      collection(firestore, "github_webhooks"),
      ...whereMatchArena(arena),
      ...whereMatchUser(user),
      ...whereMatchRule(rule)
    );

const queryEventsOfRuleInThisMonth =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    query(
      collection(firestore, "github_webhooks"),
      ...whereMatchArena(arena),
      ...whereMatchUser(user),
      ...whereMatchRule(rule),
      ...whereMatchThisMonth()
    );

const queryLatestEventOfRule =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    query(
      collection(firestore, "github_webhooks"),
      ...whereMatchArena(arena),
      ...whereMatchUser(user),
      ...whereMatchRule(rule),
      orderBy("timestamp", "desc"),
      limit(1)
    );

const latestWebhooksOfRule = (query: Query) => {
  const [webhooks, setWebhooks] = createSignal<any[]>([]);

  const unsubscribe = onSnapshot(query, (snapshot) =>
    setWebhooks((prev) => [...prev, ...snapshot.docs.map((doc) => doc.data())])
  );

  onCleanup(unsubscribe);

  return webhooks;
};

const score = (qCount: Query, qSubscribe: Query, rule: Rule) => {
  const [count, { mutate }] = createResource<[number, number]>(() =>
    getCountFromServer(qCount).then((snapshot) => [
      snapshot.data().count * rule.score,
      Date.now(),
    ])
  );

  const latest = latestWebhooksOfRule(qSubscribe);

  createEffect(() => {
    const webhooks = latest();
    mutate((prev) => {
      if (prev === undefined) {
        return;
      }
      const [score, timestamp] = prev;
      const pushed = webhooks.filter(
        (webhook) => webhook.timestamp.toDate().getTime() > timestamp
      );
      return [score + pushed.length * rule.score, Date.now()];
    });
  });

  return count;
};

export const scoreOfRule =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    score(
      queryEventsOfRule(arena, user, rule)(firestore),
      queryLatestEventOfRule(arena, user, rule)(firestore),
      rule
    );

export const scoreOfRuleInThisMonth =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    score(
      queryEventsOfRuleInThisMonth(arena, user, rule)(firestore),
      queryLatestEventOfRule(arena, user, rule)(firestore),
      rule
    );
