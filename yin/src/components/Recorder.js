import React, { useState } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import PropTypes from "prop-types";

function Recorder({ label, outputFunction }) {
  //   const [recording, setRecording] = useState([]);
  const [buttonClass, setButtonClass] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  //   useEffect(() => {
  //     const recordButton = document.getElementById("__record_button");
  //   }, []);

  async function registerMediaRecorder() {
    if (!isRegistered) {
      await register(await connect());
      setIsRegistered(true);
    }
  }

  async function processAudio(audioBlob) {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("file", audioBlob, "recorder.wav");
      fetch("http://localhost:8080/extract_pitch/wav", {
        method: "POST",
        body: formData,
      }).then((res) => {
        resolve(res.text());
      });
      // .catch((err) => {
      //   console.log(err);
      // });
    });
  }

  function record() {
    return new Promise((resolve) => {
      let audioBlob;
      let mediaRecorder;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream) => {
          //   console.log(mediaRecorder);

          // setMediaRecorder(new MediaRecorder(stream, { mimeType: 'audio/wav'}));
          mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
          //   console.log(mediaRecorder);
          mediaRecorder.start();
          setButtonClass("red");
          const audioChunks = [];

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          mediaRecorder.addEventListener("stop", () => {
            audioBlob = new Blob(audioChunks, {
              type: "audio/wav",
            });
            resolve(audioBlob);
          });

          setTimeout(() => {
            mediaRecorder.stop();
            mediaRecorder = undefined;
            // recordButton.classList.remove("red");
            // recordButton.classList.add("green");
            setButtonClass("green");
          }, 2000);
        });
      // .catch((err) => {
      // //   console.log(err);
      // //   console.log(mediaRecorder);
      //     throw(err);
      // });
    });
  }

  async function addRecordFunction() {
    await registerMediaRecorder();
    record("__record_button").then((blob) => {
      processAudio(blob).then(async (data) => {
        // Remove useless header information
        const lines = data.split("\n");
        lines.splice(0, 3);
        // Add useful column labels
        lines.unshift(["time\tfrequency"]);
        const splicedData = lines.join("\n");
        // console.log(splicedData);
        // setRecording(splicedData);
        outputFunction(splicedData);
      });
    });
  }

  return (
    <button
      onClick={addRecordFunction}
      className={buttonClass}
      id="__record_button"
      type="button"
    >
      {label}
    </button>
  );
}

Recorder.propTypes = {
  label: PropTypes.string.isRequired,
  outputFunction: PropTypes.func.isRequired,
};

export default Recorder;
