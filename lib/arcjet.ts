import arcjet, { shield, tokenBucket } from '@arcjet/next';

const key = process.env.ARCJET_KEY;

export const arcjetClient =
  key &&
  arcjet({
    key,
    rules: [
      shield({ mode: 'LIVE' }),
      tokenBucket({ mode: 'LIVE', refillRate: 20, interval: 10, capacity: 100 }),
    ],
  });
