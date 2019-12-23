import React, { Component } from 'react'
// import $ from 'jquery'
import * as d3 from 'd3'
// import * as drawf from '../helper/drawingFunctions'

class Mimicking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: []
        }
        this.addRecordFunction = this.addRecordFunction.bind(this);
        this.drawPitchCurve = this.drawPitchCurve.bind(this);
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
                        this.drawPitchCurve(url, 1100,500);
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
            if (i == 3) {
                y -= 4;
            }
            y += (height / 4);
        }
    }

    async drawPitchCurve(dataset, width, height, baseline=(height/2), standardDeviation=0, color="red") {
        d3.selectAll("svg > .userPitch").remove();
        let datarecord = new Array;
        await d3.tsv(dataset, (__data) => {
            // let zScore = stats.calcZScore(baseline,data.frequency,standardDeviation);    
            // if(isNaN(zScore)){
            // 	zScore = 0;
            // }
            let point = {time: __data.time, frequency: __data.frequency};
            datarecord.push(point);
            var zScore = 0;
                d3.select("#visualization svg")
                    .append("circle")
                    .attr("cx", __data.time * (width / 2))
                    .attr("cy", height - ((height/2) + ((__data.frequency - (height/2))))) 
                    .attr("r", 5)
                .classed("userPitch",true)
                    .style("fill",color);
            }
        );
        console.log(datarecord);
        console.log(Array.isArray(datarecord));
        console.log(datarecord.length);
        var mock = [
            {time: 0, frequency: 5},
            {time: 2, frequency: 5},
            {time: 3, frequency: 5},
            {time: 4, frequency: 5},
            {time: 5, frequency: 5},
        ]
        var mock2 = datarecord.slice(0,3);
        console.log(mock2);
        var requestPayload = {
                beep: 'boop',
                record: datarecord
            }
        console.log(requestPayload);
        console.log(JSON.stringify(requestPayload));
        fetch('http://localhost:8000/saveAudio', {
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
            <div id="visualization"></div>
            <div className={`lesson ${this.props.lessonOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}>
                <h2>Lesson Page</h2>
                <button onClick={this.addRecordFunction} id="record">Record</button>
            </div>
            </>
        )
    }
}

export default Mimicking;