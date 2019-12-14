export function calcMean(values){
	let mean = 0;
	for (let value of values){
		mean += value;
	}
	mean = mean/values.length;
	return mean;
}

export function calcStandardDeviation(mean, values){
	let squaredDifferences = [];
	for (let value of values){
		squaredDifferences.push(Math.pow((value - mean),2));
	}
	return Math.sqrt(calcMean(squaredDifferences));
}

export function calcZScore(mean,value,standardDeviation){
	let zScore = (value - mean) / standardDeviation;
	return zScore;
}
