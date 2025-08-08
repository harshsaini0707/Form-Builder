export const extractBlanks = passage =>
  [...passage.matchAll(/\[([^\]]+)?\]/g)].map(m => m[1] ?? '');
