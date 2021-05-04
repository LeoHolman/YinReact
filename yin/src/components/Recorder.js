import React, { useState, useEffect } from 'react';

const Recorder = ({outputFunction, label}) => {
    // const [recording, setRecording] = useState(
        // []
    // )
    const [buttonClass, setButtonClass] = useState('')

    useEffect(() => {
        const recordButton = document.getElementById("__record_button");
        recordButton.classList.remove('green');
    }, [])

    async function addRecordFunction() {
        record("__record_button")
            .then( blob => {
                processAudio(blob)
                    .then( async (csvDataLocation) => {
                        const start = csvDataLocation.search(/(\*\*\*)/)+5
                        const end = csvDataLocation.search('&&&')
                        var url = csvDataLocation.substring(start,end)
                        url = 'https://yin.rit.edu/' + url;
                        const data = await getDataSet(url);
                        outputFunction(data);
                    })	
            })
    }

    async function getDataSet(url){
        const data = await (await fetch(`${url}`)).text();
        return data;
    }

    function record(buttonId) {
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
                    setButtonClass('red');
    
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
                        setButtonClass('green');
                    }, 2000);
                });
        })
    };

    async function processAudio(audioBlob) {
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

    return(
        <>
            <button onClick={addRecordFunction} className={buttonClass} id="__record_button">{label}</button>
        </>
    )
}

export default Recorder;