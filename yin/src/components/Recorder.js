import React, { useState, useEffect } from 'react';
import Wad from 'web-audio-daw';

const Recorder = ({outputFunction, label}) => {
    // const [recording, setRecording] = useState(
        // []
    // )
    const [buttonClass, setButtonClass] = useState('')

    useEffect(() => {
        const recordButton = document.getElementById("__record_button");
        recordButton.classList.remove('green');
    }, [])

    var voice = new Wad({source: 'mic'});
    var tuner = new Wad.Poly();
    var myReq;
    var count = 0;
    tuner.setVolume(0);
    tuner.add(voice);
    function call_pitch(count){
            voice.play();
            tuner.updatePitch();
            setButtonClass('red');
            var logPitch = function(){
                console.log(tuner.pitch)
                myReq = requestAnimationFrame(logPitch)
            }
            logPitch();
    }
    function stop_pitch(){
        tuner.stopUpdatingPitch();
    }

    function addRecordFunction(){
        myReq = call_pitch();
        setTimeout(() => {
            console.log('Stop pitch called')
            tuner.stopUpdatingPitch();
            cancelAnimationFrame(myReq)
            setButtonClass('green');
        }, 2000);
    }


    // async function addRecordFunction() {
    //     record("__record_button")
    //         .then( blob => {
    //             processAudio(blob)
    //                 .then( async (csvDataLocation) => {
    //                     const start = csvDataLocation.search(/(\*\*\*)/)+5
    //                     const end = csvDataLocation.search('&&&')
    //                     var url = csvDataLocation.substring(start,end)
    //                     url = 'https://yin.rit.edu/' + url;
    //                     const data = await getDataSet(url);
    //                     outputFunction(data);
    //                 })	
    //         })
    // }

    // async function getDataSet(url){
    //     const data = await (await fetch(`${url}`)).text();
    //     return data;
    // }

    // function record(buttonId) {
    //     return new Promise(resolve => {
    //         // var audio;
    //         // var audioUrl;
    //         var audioBlob;
    //         // const recordButton = document.getElementById(buttonId);
    //         navigator.mediaDevices.getUserMedia({
    //                 audio: true
    //             })
    //             .then(stream => {
    //                 const mediaRecorder = new MediaRecorder(stream);
    //                 mediaRecorder.start();
    //                 setButtonClass('red');
    
    //                 const audioChunks = [];
    
    //                 mediaRecorder.addEventListener("dataavailable", event => {
    //                     audioChunks.push(event.data);
    //                 });
    
    //                 mediaRecorder.addEventListener("stop", () => {
    //                     audioBlob = new Blob(audioChunks, {
    //                         type: 'audio/wav; codecs=MS_PCM'
    //                     });
    //                     resolve(audioBlob);
    //                 });
    
    //                 setTimeout(() => {
    //                     mediaRecorder.stop();
    //                     setButtonClass('green');
    //                 }, 2000);
    //             });
    //     })
    // };

    // async function processAudio(audioBlob) {
    //     return new Promise(resolve => {
    //         // var rawResponse;
    //         // var csvDataLocation;
    //         var formData = new FormData();
    //         formData.append("audioData", audioBlob);
    //         fetch('https://yin.rit.edu/pages/audioProcessing.php', {
    //             method: 'POST', 
    //             body: formData,
    //         }).then((res) => resolve(res.text()));
    //     });
    // }

    return(
        <>
            <button onClick={addRecordFunction} className={buttonClass} id="__record_button">{label}</button>
        </>
    )
}

export default Recorder;