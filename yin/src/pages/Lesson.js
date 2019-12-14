import React, { Component } from 'react'
import $ from 'jquery'
import * as d3 from 'd3'
import * as drawf from '../helper/drawingFunctions'

class Lesson extends Component {
    constructor(props) {
        super(props);
        this.addRecordFunction = this.addRecordFunction.bind(this);
    }

    addRecordFunction() {
        // self.innerHTML = "Recording";
        this.record("record")
            .then( blob => {
                // self.innerHTML = "Done"
                this.processAudio(blob)
                    .then( csvDataLocation => {
                        const start = csvDataLocation.search(/(\*\*\*)/)+5
                        const end = csvDataLocation.search('&&&')
                        var url = csvDataLocation.substring(start,end)
                        url = 'https://yin.rit.edu/' + url;
                        this.drawPitchCurve(url, 800,800);
                    })	
            })
    }

    record(buttonId) {
        return new Promise(resolve => {
            var audio;
            var audioUrl;
            var audioBlob;
            const recordButton = document.getElementById(buttonId);
            navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    recordButton.style.backgroundColor = "red";
    
                    const audioChunks = [];
    
                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });
    
                    mediaRecorder.addEventListener("stop", () => {
                        audioBlob = new Blob(audioChunks, {
                            type: 'audio/wav; codecs=MS_PCM'
                        });
                        resolve(audioBlob);
                    });
    
                    setTimeout(() => {
                        mediaRecorder.stop();
                        recordButton.style.backgroundColor = "green";
                    }, 2000);
                });
        })
    };

    async processAudio(audioBlob) {
        return new Promise(resolve => {
            var rawResponse;
            var csvDataLocation;
            var formData = new FormData();
            formData.append("audioData", audioBlob);
            fetch('https://yin.rit.edu/pages/audioProcessing.php', {
                method: 'POST', 
                body: formData,
            }).then((res) => resolve(res.text()));
        });
    }

    drawPitchChart(divID, width, height) {
        d3.select('#visualization')
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

    drawPitchCurve(dataset, width, height, baseline=(height/2), standardDeviation=0, color="red") {
        d3.selectAll("svg > .userPitch").remove();
        d3.tsv(dataset, function(__data) {
        // let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
        // if(isNaN(zScore)){
        // 	zScore = 0;
        // }
        var zScore = 0;
            d3.select("#visualization svg")
                .append("circle")
                .attr("cx", __data.time * (width / 2))
                .attr("cy", height - ((height/2) + ((__data.frequency - (height/2))))) 
                .attr("r", 5)
            .classed("userPitch",true)
                .style("fill",color);
        });
    };

    componentDidMount(){
        this.drawPitchChart('visualization', 800, 800);
        console.log('Mounted!')
    }

    render(){
        return(
            <>
            <div id="visualization"></div>
            <div className={`lesson ${this.props.lessonOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}>
                <h2>Lesson Page</h2>
                <button onClick={this.addRecordFunction} id="record">Record</button>
            </div>
            </>
        )
    }
}

export default Lesson;