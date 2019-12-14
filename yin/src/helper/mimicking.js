import * as af from "./audioFunctions.js";
import * as drawf from "./drawingFunctions.js";
import * as stat from "./stats.js";
import * as df from "./displayFunctions.js";
import * as pi from "./pageInteractions.js";
import * as d3 from 'd3'

//set button handles
// var recordButton = document.getElementById("record");
// var playButton = document.getElementById("play");
// var cont = document.getElementById("continue-btn");
// const baselineButton = document.getElementById("baseline");

//page setup
// pi.pageSetup();
// pi.loadTests(3,"huanglaoshiTestsShortened");

//initialize baseline variables
// var baselineMax;
// var baselineMin;
// var baselineAvg;
// var baselineMean;
// var baselineStandardDeviation;


//draw graph
// drawf.drawPitchChart('#visualization',750,350);
function addRecordFunction() {
	df.countdown(self).then( () =>{
		self.innerHTML = "Recording";
		af.record("record")
			.then( blob => {
				// var resetplayButton = playButton.cloneNode(true);
				// playButton.parentElement.replaceChild(resetplayButton, playButton);
				// playButton = document.getElementById("play");
				// playButton.addEventListener("click", () => {
				// 	var blobUrl = URL.createObjectURL(blob);
				// 	var audio = new Audio(blobUrl);
				// 	audio.play();
				// });
				self.innerHTML = "Done"
				af.processAudio(blob)
					.then( csvDataLocation => {
						console.log(csvDataLocation);
						// var frequencyset = [];
						// d3.tsv(csvDataLocation,	function(data){
						// 		frequencyset.push(+data.frequency); 
						// 		return frequencyset;
						// }).then( () =>{		
						// baselineStandardDeviation = stat.calcStandardDeviation(baselineMean,frequencyset);
						// drawf.drawPitchCurve(csvDataLocation,750,350,baselineMean,baselineStandardDeviation);
						// self.style.backgroundColor = "#5E99D3"; 
						// self.innerHTML = "Record";
						// })	
					})	
			})
		})
}
// //set record function
// recordButton.addEventListener("click", () => {
	
// });

// //set baseline function
// baselineButton.addEventListener("click", () => {
// 	df.countdown(baselineButton).then( () =>{
// 	baselineButton.innerHTML = "Recording";
// 	af.record("baseline")
// 		.then( blob => {
// 			af.processAudio(blob)
// 				.then( csvDataLocation => {
// 					var frequencyset = [];
// 					d3.tsv(csvDataLocation,	function(data){
// 							frequencyset.push(+data.frequency); 
// 							return frequencyset;
// 					}).then( () =>{		
// 							baselineMean = stat.calcMean(frequencyset);
// 							baselineButton.innerHTML = "Done";
                        
// 						//	console.log(`Baseline mean ${baselineMean}`);
// 					} );	
				
// 				});	
// 			});
// 	var resetCont = cont.cloneNode(true);
// 	cont.parentElement.replaceChild(resetCont, cont);
// 	cont = document.getElementById("continue-btn");
//     cont.addEventListener("click",() => {
// 	    pi.advance(3);
//     });
// });
// });

// function clearUploads() {
// 	var clearUploads = new XMLHttpRequest();
// 	clearUploads.open("GET","../pages/clearUploads.php");
// 	clearUploads.send();
// }

// clearUploads();
export default addRecordFunction;