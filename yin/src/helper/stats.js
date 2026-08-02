export function calcMean(values) {
  let mean = 0;
  for (const value of values) {
    mean += value;
  }
  mean /= values.length;
  return mean;
}

export function calcStandardDeviation(mean, values) {
  const squaredDifferences = [];
  for (const value of values) {
    squaredDifferences.push((value - mean) ** 2);
  }
  return Math.sqrt(calcMean(squaredDifferences));
}

export function calcZScore(mean, value, standardDeviation) {
  const zScore = (value - mean) / standardDeviation;
  return zScore;
}
