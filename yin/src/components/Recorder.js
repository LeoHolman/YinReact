import React, { useState, useEffect } from 'react';
import Wad from 'web-audio-daw';

const Recorder = ({outputFunction, label}) => {
    // const [recording, setRecording] = useState(
        // []
    // )
    const [buttonClass, setButtonClass] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        const recordButton = document.getElementById("__record_button");
        recordButton.classList.remove('green');
    }, [])

    var voice = new Wad({
        source: 'mic',
        filter: [{
            type: 'highpass',
            frequency: 50
        },
        {   type: 'lowpass',
            frequency: 1000
        }],
        averaging: 0.5,
        recorder: {
            options: {
                audioBitsPerSecond : 5120000,
            }
        }
    });
    var tuner = new Wad.Poly();
    var myReq;
    tuner.setVolume(0);
    tuner.add(voice);
    function call_pitch(timeStart){
            var new_data = []
            voice.play();
            tuner.updatePitch();
            setButtonClass('red');
            var logPitch = function(timestamp){
                // console.log(tuner.pitch)
                var currTime = new Date().getTime();
                new_data.push({time: (currTime - timeStart) / 1000, frequency: tuner.pitch})
                // new_data.push({time: timestamp/1000, frequency: tuner.pitch})
                myReq = requestAnimationFrame(logPitch)
            }
            logPitch();
            return new_data
    }
    function stop_pitch(){
        tuner.stopUpdatingPitch();
        cancelAnimationFrame(myReq)
        setButtonClass('green');
    }

    function addRecordFunction(){
        var timeStart = new Date().getTime();
        var data = call_pitch(timeStart);
        setTimeout(() => {
            stop_pitch();
            let definedData = data.filter((__data) => {
                if ((__data.frequency) === undefined){
                    return false;
                }
                return true;
            });
            let tsvData = convertArrayTSV(definedData);
            outputFunction(tsvData)
        }, 2000);
    }

    function convertArrayTSV(arr){
        let columnDelim = '\t';
        let lineDelim = '\n';
        let label = ['time', 'frequency']
        let output = '' + label.join(columnDelim) + columnDelim + lineDelim; 

        arr.forEach( (item) => {
            let newLine = item['time'] + columnDelim + item['frequency'] + columnDelim + lineDelim;
            output += newLine
        })
        return output;
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