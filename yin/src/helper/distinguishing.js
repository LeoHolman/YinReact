import * as df from './displayFunctions.js';
import * as pi from './pageInteractions.js';

pi.pageSetup();

pi.loadTests(1);

//create new test on click
document.getElementById("continueButton").addEventListener("click", () => {
	if(df.responseGiven){
	    pi.newTest(1);
	}
})

document.getElementById("skipToEnd").addEventListener("click", () => {
	df.showScoreCard("activity-one", "lesson-one-ref");	
})
