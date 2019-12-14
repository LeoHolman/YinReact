import * as af from "./audioFunctions.js";
import * as drawf from "./drawingFunctions.js";
import * as stat from "./stats.js";
import * as df from "./displayFunctions.js";

//set button handles
const recordButton = document.getElementById("record");
var playButton = document.getElementById("play");

//draw graph
drawf.drawPitchChart('#visualization',750,350);


//set record function
recordButton.addEventListener("click", () => {
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
					//baselineStandardDeviation = stat.calcStandardDeviation(baselineMean,frequencyset);
					//drawf.drawPitchCurve(csvDataLocation,750,350,baselineMean,baselineStandardDeviation);
					plotWithoutZScore(csvDataLocation, 750, 350);
					})	
				})	
		})
});

function plotWithoutZScore(dataset, width, height, baseline=(height/2)){
	d3.selectAll("svg > .userPitch").remove();
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

function clearUploads() {
	var clearUploads = new XMLHttpRequest();
	clearUploads.open("GET","../pages/clearUploads.php");
	clearUploads.send();
}

clearUploads();
