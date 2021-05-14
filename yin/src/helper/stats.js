export function calcMean(values){
	let mean = values.reduce((a, b) => Number(a) + Number(b), 0);
	mean = mean/values.length;
	return mean;
}

export function calcStandardDeviation(mean, values){
	// let squaredDifferences = [];
	// for (let value of values){
		// squaredDifferences.push(Math.pow((value - mean),2));
	// }
	let squaredDifferences = values.map((val) => Math.pow((Number(val) - Number(mean)), 2)); 
	return Math.sqrt(calcMean(squaredDifferences));
}

export function calcZScore(mean,value,standardDeviation){
	let zScore = (Number(value) - mean) / standardDeviation;
	return zScore;
}
