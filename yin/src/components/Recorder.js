import React, { useState } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import PropTypes from "prop-types";
import registerMediaRecorder from "../helper/recorderService";

function Recorder({ label, outputFunction }) {
  const [buttonClass, setButtonClass] = useState("");

  async function processAudio(audioBlob) {
    return new Promise(async (resolve) => {
      const formData = new FormData();
      formData.append("file", audioBlob, "recorder.wav");
      const result = await fetch("http://localhost:8080/extract_pitch/wav", {
        method: "POST",
        body: formData,
      });
      resolve(result.text());
    });
  }

  async function record() {
    return new Promise(async (resolve) => {
      let audioBlob;
      let mediaRecorder;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

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
  }

  async function addRecordFunction() {
    await registerMediaRecorder();
    const blob = await record("__record_button");
    const data = await processAudio(blob);

    // Remove useless header information
    const lines = data.split("\n");
    lines.splice(0, 3);
    // Add useful column labels
    lines.unshift(["time\tfrequency"]);
    const splicedData = lines.join("\n");
    outputFunction(splicedData);
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
