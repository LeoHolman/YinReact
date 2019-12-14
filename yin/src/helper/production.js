import * as af from "./audioFunctions.js";
import * as drawf from "./drawingFunctions.js";
import * as stat from "./stats.js";
import * as df from "./displayFunctions.js";
import * as pi from "./pageInteractions.js";

//set button handles
const recordButton = document.getElementById("record");
const baselineButton = document.getElementById("baseline");
var cont = document.getElementById("continue-btn");
var playButton = document.getElementById("play");

//initialize baseline variables
var baselineMax;
var baselineMin;
var baselineAvg;
var baselineMean;
var baselineStandardDeviation;

function clearUploads() {
	var clearUploads = new XMLHttpRequest();
	clearUploads.open("GET","../pages/clearUploads.php");
	clearUploads.send();
}

//page setup
pi.pageSetup();
pi.loadTests(4,"huanglaoshiTestsShortened");


//draw graph
drawf.drawPitchChart('#visualization',750,350);

//set record function
recordButton.addEventListener("click", () => {
	df.countdown(recordButton).then( () =>{
	recordButton.innerHTML = "Recording";
	af.record("record")
		.then( blob => {
			var resetplayButton = playButton.cloneNode(true);
			playButton.parentElement.replaceChild(resetplayButton, playButton);
			playButton = document.getElementById("play");
			playButton.addEventListener("click", () => {
				var blobUrl = URL.createObjectURL(blob);
				var audio = new Audio(blobUrl);
				audio.play();
			});
			af.processAudio(blob)
				.then( csvDataLocation => {
					var frequencyset = [];
					d3.tsv(csvDataLocation,	function(data){
							frequencyset.push(+data.frequency); 
							return frequencyset;
					}).then( () =>{		
					baselineStandardDeviation = stat.calcStandardDeviation(baselineMean,frequencyset);
					drawf.drawPitchCurve(csvDataLocation,750,350,baselineMean,baselineStandardDeviation);
					pi.showVisualization();
					recordButton.style.backgroundColor = "#5E99D3"; 
					recordButton.innerHTML = "Record";
					})	
				})	
		})
	})
});

//set baseline function
baselineButton.addEventListener("click", () => {
	df.countdown(baselineButton).then( () =>{
	baselineButton.innerHTML = "Recording";
	af.record("baseline")
		.then( blob => {
			af.processAudio(blob)
				.then( csvDataLocation => {
					var frequencyset = [];
					d3.tsv(csvDataLocation,	function(data){
							frequencyset.push(+data.frequency); 
							return frequencyset;
					}).then( () =>{		
							baselineMean = stat.calcMean(frequencyset);
							baselineButton.innerHTML = "Done";
                        
						//	console.log(`Baseline mean ${baselineMean}`);
					} );	
				
				});	
			});
	var resetCont = cont.cloneNode(true);
	cont.parentElement.replaceChild(resetCont, cont);
	cont = document.getElementById("continue-btn");
    cont.addEventListener("click",() => {
	    pi.advance(4);
    });
});
});

clearUploads();
