import React, { useState } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import PropTypes from "prop-types";
import registerMediaRecorder from "../helper/recorderService";

function Recorder({ label, outputFunction }) {
  const [buttonClass, setButtonClass] = useState("");

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
          mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
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
            setButtonClass("green");
          }, 2000);
        });
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
