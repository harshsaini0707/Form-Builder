export function validateCategorize(userAns, correctAns) {
  if (!userAns || !correctAns) return false;
  return Object.keys(correctAns).every(cat =>
    Array.isArray(userAns[cat]) &&
    correctAns[cat].length === userAns[cat].length &&
    correctAns[cat].every(item => userAns[cat].includes(item))
  );
}

export function validateCloze(userArr, correctArr) {
  if (!Array.isArray(userArr) || !Array.isArray(correctArr)) return false;
  return userArr.every(
    (ans, i) => (correctArr[i] ?? '').toLowerCase() === ans.toLowerCase()
  );
}

export function clozeScore(userArr, correctArr, pts = 1) {
  const hits = userArr.filter(
    (ans, i) => (correctArr[i] ?? '').toLowerCase() === ans.toLowerCase()
  ).length;
  return (hits / correctArr.length) * pts;
}

export function validateComprehension(ans, correct) {
  return (ans ?? '').toLowerCase() === (correct ?? '').toLowerCase();
}
