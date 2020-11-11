import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'

const PitchChart = ({dataset}) => {
    
    function drawPitchChart(divID, width, height) {
        d3.select(`#${divID}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#eeeeee')
            .style('border','3px solid #9A2D04');
        var y = 2;
        var i;
        for (i = 0; i < 5; i++) {
            d3.select(`#${divID} svg`)
                .append('line')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)
                .style('stroke', '#babbbc')
                .style('stroke-width', '3px');
            if (i === 3) {
                y -= 4;
            }
            y += (height / 4);
        }
    }
    
     function drawPitchCurve(dataset, width, height, {baseline=(height/2), standardDeviation=0, color="red", chartID="__visualization"} = {}) {
        let datarecord = [];
        const parsedData = d3.tsvParse(dataset);
        parsedData.map((__data) => {
            // let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
            // if(isNaN(zScore)){
            // 	zScore = 0;
            // }
            let point = {time: __data.time, frequency: __data.frequency};
            datarecord.push(point);
            // var zScore = 0;
            var x = __data.time * (width / 2);
            var y = height - ((height/2) + ((__data.frequency - (height/2))));
            return d3.select(`#${chartID} svg`)
                .append("circle")
                .attr("cx", x)
                .attr("cy", y) 
                .attr("r", 5)
                .classed("userPitch",true)
                .style("fill",color);
            }
        );
    };

    useEffect(() => {
        d3.selectAll("svg").remove();
        drawPitchChart('__visualization', 1100, 500);
        dataset.map( (curve) => {
            return drawPitchCurve(curve[0], 1100, 500, {color:curve[1]});
        });
    })

    return(
        <>
            <div id="__visualization"> 
            </div>
        </>
    )
}

export default PitchChart;