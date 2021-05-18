import React, { useState, useEffect } from 'react';
// import Wad from 'web-audio-daw';
// import * as p5 from 'p5';
import fft from 'fft-js'; 

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

    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    
    navigator.getUserMedia(
      { audio: true },
      stream => {
        audioContext.createMediaStreamSource(stream).connect(analyser);
    
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
        analyser.getByteFrequencyData(dataArray);
      },
      err => console.log(err)
    );

    function getLoudestFrequency() {
        var nyquist = 22050
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray)
        console.log(dataArray);
        var spectrum = fft.fft(dataArray) // array of amplitudes in bins
        var numberOfBins = spectrum.length;
        var maxAmp = 0;
        var largestBin;
    
        for (var i = 0; i < numberOfBins; i++) {
            var thisAmp = spectrum[i]; // amplitude of current bin
            if (thisAmp > maxAmp) {
                maxAmp = thisAmp;
                largestBin = i;
            }
        }
    
        var loudestFreq = largestBin * (nyquist / numberOfBins);
        return loudestFreq;
    }

    function addRecordFunction(){
        var timeStart = new Date().getTime();
        var intervalID = setInterval(()=> {
            var pitch = getLoudestFrequency(); 
            console.log(pitch)
        }, 500);
        setTimeout(() => {
            // let tsvData = convertArrayTSV(definedData);
            // outputFunction(tsvData)
            clearInterval(intervalID);
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

// P5 JS NEW INPUT ~~~~~~~~~~~~~~~~~~~~~~~!
    // let x = 0;

    // function setup() {
    //     p5.noCanvas()
    //     p5.noFill();

    //     mic = new p5.AudioIn();
    //     mic.start();
    //     fft = new p5.FFT();
    //     fft.setInput(mic);
    // }
    
    // function getLoudestFrequency() {
    //     var nyquist = p5.sampleRate() / 2; // 22050
    //     var spectrum = fft.analyze(); // array of amplitudes in bins
    //     var numberOfBins = spectrum.length;
    //     var maxAmp = 0;
    //     var largestBin;
    
    //     for (var i = 0; i < numberOfBins; i++) {
    //         var thisAmp = spectrum[i]; // amplitude of current bin
    //         if (thisAmp > maxAmp) {
    //             maxAmp = thisAmp;
    //             largestBin = i;
    //         }
    //     }
    
    //     var loudestFreq = largestBin * (nyquist / numberOfBins);
    //     return loudestFreq;
    // }
    
    // function draw() {
    //   background(220);
    //   var pitch = getLoudestFrequency();
    //   console.log(pitch);
      
    //   ellipse(x, pitch, 5, 5)
    //   x += 1
    //   if (x > 710){
    //     x = 0;
    //   }
    // }

    
    

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