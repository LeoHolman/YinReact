import React, { Component } from 'react'
import $ from 'jquery'
// import addRecordFunction from '../helper/mimicking.js' 
// import * as df from "./displayFunctions.js";
// import * as af from "./audioFunctions.js";
// import * as d3 from '../helper/d3.js'

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
                        console.log(csvDataLocation);
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
            // $.ajax({
            //     url: "https://yin.rit.edu/pages/audioProcessing.php",
            //     type: "POST",
            //     crossDomain: true,
            //     data: formData,
            //     success: function (response) {
            //         console.log(response);
            //     },
            //     error: function (xhr, status) {
            //         alert("error");
            //     }
            // });
            fetch('https://yin.rit.edu/pages/audioProcessing.php', {
                method: 'POST', 
                // mode: 'no-cors',
                body: formData,
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Access-Control-Allow-Origin': 'https://yin.rit.edu/pages/audioProcessing.php'
                }
            }).then((res) => resolve(res.text()));// (response) => resolve(response)


            // var xhttp = new XMLHttpRequest();
            // xhttp.open("POST", "https://yin.rit.edu/pages/audioProcessing.php", true);
            // xhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
            // xhttp.setRequestHeader('lalalal', 'loloolo')
            // xhttp.send(formData);
            // xhttp.onreadystatechange = function() {
            // if (this.readyState == 4 && this.status == 200) {
            //     //put graph display here
            //     rawResponse = this.responseText;
            //     var start = rawResponse.indexOf("***") + 3;
            //     var end = rawResponse.indexOf("&&&");
            //     csvDataLocation = rawResponse.substring(start, end);
            //     //console.log(csvDataLocation);
            //     resolve(csvDataLocation);
            //         }
            //     };
        });
    }

    render(){
        return(
            <div className={`lesson ${this.props.lessonOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}>
                <h2>Lesson Page</h2>
                <button onClick={this.addRecordFunction} id="record">Record</button>
            </div>
        )
    }
}

export default Lesson;