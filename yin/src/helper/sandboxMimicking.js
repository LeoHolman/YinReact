import * as af from "./audioFunctions.js";
import * as drawf from "./drawingFunctions.js";
import * as stat from "./stats.js";
import * as df from "./displayFunctions.js";

//set button handles
const recordButton = document.getElementById("record");
const playButton = document.getElementById("play");
const baselineButton = document.getElementById("baseline");
var cont = document.getElementById("continue-btn");

    cont.addEventListener("click", () => {
	   newTest();
	});
//initialize baseline variables
var baselineMax;
var baselineMin;
var baselineAvg;
var baselineMean;
var baselineStandardDeviation;

//pi.loadTests(3);

var tests;
var testsArray = [];
var shownTests = [];

var huangLaoshifrequencyset = [];
var huangLaoshibaselineStandardDeviation;
//Access tests.json
$.getJSON("../js/huanglaoshiTests.json", function(json){
    tests = json;

    for(var i in tests){
        testsArray.push(tests [i]);
    }

	d3.tsv("../assets/sounds/huanglaoshi/csv/baselineChinese.csv",	function(data){
			huangLaoshifrequencyset.push(+data.frequency); 
			return huangLaoshifrequencyset;
	}).then( () =>{		
		let hlsBaseline = 0;
		huangLaoshifrequencyset.forEach( (element) => {hlsBaseline += element});
		//console.log("All values added: " + hlsBaseline);
		hlsBaseline = hlsBaseline / huangLaoshifrequencyset.length;
		//console.log("Baseline after division: " + hlsBaseline);
	huangLaoshibaselineStandardDeviation = stat.calcStandardDeviation(210,huangLaoshifrequencyset);
	//console.log("hls Baseline stndrd dev " +huangLaoshibaselineStandardDeviation);
//	drawf.drawPitchCurve(csvDataLocation,1000,350,210,huangLaoshibaselineStandardDeviation);
	}).then ( () =>{
	    newTest();
	});
});

//english median 204
//range 270 - 85
//
//chinese media 210
//range 480 - 154
var thisTestNumber;
var thisTest;
function newTest(){
	//find new test
	thisTestNumber = df.getRandomInt(23);
	while (shownTests.includes(thisTestNumber)){
		thisTestNumber = df.getRandomInt(23);
	}
	shownTests.push(thisTestNumber);
	thisTest = testsArray[thisTestNumber];

	//add stimuli
	df.addSound(thisTest, "audioSource");
	//console.log(thisTestNumber);
	let csvFile = testsArray[thisTestNumber].id.replace(/[0-9]/g, '');
	//console.log(csvFile);
	//console.log("hls Baseline stndrd dev " +huangLaoshibaselineStandardDeviation);
	//
	drawf.drawNativePitchCurve(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`, 750, 350, 225, 100, "blue");
//	plotWithoutZScore(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`,750, 350);
//	lopStartEnd(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`,750, 350);

	let feedbackBox = document.getElementById("character");
	feedbackBox.innerHTML = `<strong>${thisTest.character}</strong>`;
//	drawf.drawNativePitchCurve(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`, 750, 350, 225, 100, "blue");
}

//draw graph
drawf.drawPitchChart('#visualization',750,350);

//set record function
recordButton.addEventListener("click", () => {
	af.record("record")
		.then( blob => {
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
					})	
				})	
		})
});

//set baseline function
baselineButton.addEventListener("click", () => {
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
						//	console.log(`Baseline mean ${baselineMean}`);
					} );	
				
				});	
			});
		});
var frameNumber;
function plotWithoutZScore(dataset, width, height, baseline=(height/2)){
	//console.log("no zscore");
	d3.selectAll("svg > .userPitch").remove();
	frameNumber = 0;
	//console.log(`Dataset length: ${dataset.length}`);
	d3.tsv(dataset, function(data) {
			d3.select("#visualization svg")
			.append("circle")
			.attr("cx", data.time * (width / 2))
			.attr("cy", height - ((height/2) + ((data.frequency - baseline)))) 
			.attr("r", 5)
			.classed("userPitch",true)
			.style("fill","green");
	    });
};

function lopStartEnd(dataset, width, height, baseline=(height/2)){
	//console.log("no zscore");
	d3.selectAll("svg > .userPitch").remove();
	frameNumber = 0;
	let datasetLength = 0;
	d3.tsv(dataset, (data) => {
		datasetLength++;
		return datasetLength;
	}).then( () => {
	console.log(`Dataset length: ${datasetLength}`);
	d3.tsv(dataset, function(data) {
		frameNumber++;
		if(frameNumber > 10 && frameNumber < datasetLength - 10){
			d3.select("#visualization svg")
			.append("circle")
			.attr("cx", data.time * (width / 2))
			.attr("cy", height - ((height/2) + ((data.frequency - baseline)))) 
			.attr("r", 5)
			.classed("userPitch",true)
			.style("fill","yellow");
	    };
	//	console.log(`Frame number: ${frameNumber}`)
	})
	});
};
function clearUploads() {
	var clearUploads = new XMLHttpRequest();
	clearUploads.open("GET","../pages/clearUploads.php");
	clearUploads.send();
}

clearUploads();
