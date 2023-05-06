export const aggregateScores =
  (scores: (() => [number, number] | undefined)[]) => () =>
    scores
      .map((score) => score())
      .reduce(
        (acc, item) => {
          if (!acc || !item) {
            return undefined;
          }
          const [total, updatedAt] = acc;
          const [score, timestamp] = item;
          return [total + score, Math.max(updatedAt, timestamp)];
        },
        [0, 0]
      );
