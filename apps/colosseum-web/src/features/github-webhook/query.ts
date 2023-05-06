import {
  collection,
  query,
  where,
  type Firestore,
  Query,
  getCountFromServer,
} from "firebase/firestore";

import { type Arena } from "./arena";
import { type Rule } from "./rule";
import { type User } from "./user";

const whereMatchArena = (arena: Arena) => {
  switch (arena.type) {
    case "organization":
      return [where("organization.id", "==", arena.id)];
    case "repository":
      return [where("repository.id", "==", arena.id)];
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

const countByQuery =
  (query: (firestore: Firestore) => Query) => (firestore: Firestore) =>
    getCountFromServer(query(firestore)).then(
      (snapshot) => snapshot.data().count
    );

export const scoreOfRule =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    countByQuery(queryEventsOfRule(arena, user, rule))(firestore).then(
      (count) => count * rule.score
    );

export const scoreOfRuleInThisMonth =
  (arena: Arena, user: User, rule: Rule) => (firestore: Firestore) =>
    countByQuery(queryEventsOfRuleInThisMonth(arena, user, rule))(
      firestore
    ).then((count) => count * rule.score);
