import React, { Component } from 'react'
// import $ from 'jquery'
import * as d3 from 'd3'
// import * as drawf from '../helper/drawingFunctions'
import Recorder from './Recorder';

class Mimicking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: []
        }
        this.drawPitchCurve = this.drawPitchCurve.bind(this);
    }

    drawPitchChart(divID, width, height) {
        d3.select(`#${divID}`)
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
            if (i === 3) {
                y -= 4;
            }
            y += (height / 4);
        }
    }

    simpleLog(input){
        console.log(input);
    }

    async drawPitchCurve(dataset, width, height, baseline=(height/2), standardDeviation=0, color="red") {
        d3.selectAll("svg > .userPitch").remove();
        let datarecord = [];
        await d3.tsv(dataset, (__data) => {
            // let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
            // if(isNaN(zScore)){
            // 	zScore = 0;
            // }
            let point = {time: __data.time, frequency: __data.frequency};
            datarecord.push(point);
            // var zScore = 0;
                d3.select("#visualization svg")
                    .append("circle")
                    .attr("cx", __data.time * (width / 2))
                    .attr("cy", height - ((height/2) + ((__data.frequency - (height/2))))) 
                    .attr("r", 5)
                .classed("userPitch",true)
                    .style("fill",color);
            }
        );
        var requestPayload = {
                record: datarecord
            }
        fetch('http://localhost:8000/recordings/add/', {
            method: "POST",
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestPayload)
        }).then( (res) => {
            console.log(`${res.statusText}`)
        });
        this.setState({record: datarecord}, () => {
            console.log(`${this.state.record}`);
        });
    };

    componentDidMount(){
        this.drawPitchChart('visualization', 1100, 500);
    }

    render(){
        return(
            
            <>
                <Recorder outputFunction={this.simpleLog} />
            </>
        )
    }
}

export default Mimicking;