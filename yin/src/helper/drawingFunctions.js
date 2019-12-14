import * as stats from "./stats.js";
import * as d3 from 'd3';

export function drawPitchChart(divID, width, height) {
    d3.select(divID)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#eeeeee')
        .style('border','3px solid #9A2D04');

    var y = 2;
    var i;
    for (i = 0; i < 5; i++) {
        d3.select('#visualization svg')
            .append('line')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
            .style('stroke', '#babbbc')
            .style('stroke-width', '3px');
        if (i == 3) {
            y -= 4;
        }
        y += (height / 4);
    }
}

/* How to arrive at the equation for the y value.
 * d3 canvas is upside down, for high values to appear at the top
 * the eqation must be displayed as
 * y = (height - value)
 *
 * Deviance from baseline is measured as (value - baseline) such
 * that values higher than the baseline will create a positive value
 * and values lower than the baseline come out negative.
 * To center that value (since the result of value - baseline is 
 * usually small) half the height is added.
 * The equation is then 
 * y = (height - ((height/2) + (value - baseline))
 *
 * In order to scale the range of values to the height of the graph
 * one fifth of the height is multipled by the zScore (both to extend
 * values higher and to invert when negative)
 * The final equation becomes
 * y = (height - ((height/2) + ((value - baseline) + ((height/5) * zScore))))
 */
export function drawPitchCurve(dataset, width, height, baseline=(height/2), standardDeviation=0, color="red") {
	d3.selectAll("svg > .userPitch").remove();
    d3.tsv(dataset, function(data) {
	// let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
	// if(isNaN(zScore)){
	// 	zScore = 0;
    // }
    var zScore = 0;
        d3.select("#visualization svg")
            .append("circle")
            .attr("cx", data.time * (width / 2))
            .attr("cy", height - ((height/2) + ((data.frequency - baseline) + ((height/12) * zScore)))) 
            .attr("r", 5)
	    .classed("userPitch",true)
            .style("fill",color);
    });
};

export function drawNativePitchCurve(dataset, width, height, baseline=(height/2), standardDeviation=0, color="blue") {
	d3.selectAll("svg > .nativePitch").remove();
    d3.tsv(dataset, function(data) {
	let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
	if(isNaN(zScore)){
		zScore = 0;
	}
	var xpos = data.time * (width / 2);
	var ypos = height - ((height/2) + ((data.frequency - baseline) + ((height/12) * zScore)));	
        d3.select("#visualization svg")
            .append("circle")
            .attr("cx", xpos)
            .attr("cy", ypos) 
            .attr("r", 5)
	    .classed("nativePitch",true)
            .style("fill",color);
    });
};
