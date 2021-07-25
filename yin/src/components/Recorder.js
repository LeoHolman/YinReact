import React, { useState, useEffect } from 'react';
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

let mediaRecorder = '';
function Recorder(props) {
    const [recording, setRecording] = useState([]);
    const [buttonClass, setButtonClass] = useState('');
    // const [mediaRecorder, setMediaRecorder] = useState('');

    useEffect(() => {
        const recordButton = document.getElementById("__record_button");
        connect()
        .then(register)
        .then(() => {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            .then((stream) => {
                console.log(mediaRecorder);
                if (mediaRecorder === ''){
                    // setMediaRecorder(new MediaRecorder(stream, { mimeType: 'audio/wav'}));
                    mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/wav'});
                    console.log(mediaRecorder);
                }
            })
            .catch((err) => {
                console.log(err);
                console.log(mediaRecorder);
            });
        })
        .catch((err) => {
            console.log(err);
        })
}, []);

async function addRecordFunction() {
    await register(await connect());
    record("__record_button")
        .then( blob => {
            processAudio(blob)
                .then( async (data) => {
                    // Remove useless header information
                    let lines = data.split('\n');
                    lines.splice(0,3);
                    // Add useful column labels
                    lines.unshift(['time\tfrequency']);
                    const splicedData = lines.join('\n');
                    console.log(splicedData);
                    setRecording(splicedData) 
                        props.outputFunction(splicedData);
                    })	
            })
    }

    function record(buttonId) {
        return new Promise(resolve => {
            var audioBlob;
                    mediaRecorder.start();
                    setButtonClass('red');
    
                    const audioChunks = [];
    
                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });
    
                    mediaRecorder.addEventListener("stop", () => {
                        audioBlob = new Blob(audioChunks, {
                            type: 'audio/wav'
                        });
                        resolve(audioBlob);
                    });
    
                    setTimeout(() => {
                        mediaRecorder.stop();
                        mediaRecorder = undefined;
                        // recordButton.classList.remove("red");
                        // recordButton.classList.add("green");
                        setButtonClass('green');
                    }, 2000);
                });
    };

    async function processAudio(audioBlob) {
        return new Promise(resolve => {
            var formData = new FormData();
            formData.append("file", audioBlob, "recorder.wav");
            fetch('http://localhost:8080/extract_pitch/wav', {
                method: 'POST', 
                body: formData,
            })
                .then((res) => {
                    resolve(res.text())
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    return(
        <button onClick={addRecordFunction} className={buttonClass} id="__record_button">{props.label}</button>
    )
}

export default Recorder;