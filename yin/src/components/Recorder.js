import React, { Component } from 'react';

class Recorder extends Component {
    constructor(props){
        super(props);
        this.state = {
            record: [],
            button_class: ''
        }
        this.addRecordFunction = this.addRecordFunction.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        const recordButton = document.getElementById("__record_button");
        recordButton.classList.remove('green');
    }

    async addRecordFunction() {
        // self.innerHTML = "Recording";
        this.record("__record_button")
            .then( blob => {
                // self.innerHTML = "Done"
                this.processAudio(blob)
                    .then( async (csvDataLocation) => {
                        const start = csvDataLocation.search(/(\*\*\*)/)+5
                        const end = csvDataLocation.search('&&&')
                        var url = csvDataLocation.substring(start,end)
                        url = 'https://yin.rit.edu/' + url;
                        const data = await this.getDataSet(url);
                        this.props.outputFunction(data);
                    })	
            })
    }

    async getDataSet(url){
        const data = await (await fetch(`${url}`)).text();
        return data;
    }

    record(buttonId) {
        return new Promise(resolve => {
            // var audio;
            // var audioUrl;
            var audioBlob;
            // const recordButton = document.getElementById(buttonId);
            navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    // recordButton.classList.remove("green");
                    // recordButton.classList.add("red");
                    this.setState({button_class:'red'});
    
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
                        // recordButton.classList.remove("red");
                        // recordButton.classList.add("green");
                        this.setState({button_class:'green'});
                    }, 2000);
                });
        })
    };

    async processAudio(audioBlob) {
        return new Promise(resolve => {
            // var rawResponse;
            // var csvDataLocation;
            var formData = new FormData();
            formData.append("audioData", audioBlob);
            fetch('https://yin.rit.edu/pages/audioProcessing.php', {
                method: 'POST', 
                body: formData,
            }).then((res) => resolve(res.text()));
        });
    }

    render() {
        return(
            <>
                <button onClick={this.addRecordFunction} className={this.state.button_class} id="__record_button">{this.props.label}</button>
            </>
        )
    }
}

export default Recorder;