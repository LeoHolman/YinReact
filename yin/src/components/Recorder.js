import React, { useState } from "react";
import { MediaRecorder } from "extendable-media-recorder";
import PropTypes from "prop-types";
import registerMediaRecorder from "../helper/recorderService";
import extractPitchFromAudioBlob from "../helper/extractPitch";

function Recorder({ label, outputFunction }) {
  const [buttonClass, setButtonClass] = useState("");

  async function processAudio(audioBlob) {
    const result = await extractPitchFromAudioBlob(audioBlob);
    if (!result) {
      return "";
    }
    return result;
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
    try {
      await registerMediaRecorder();
      const blob = await record("__record_button");
      const data = await processAudio(blob);

      if (!data) {
        return;
      }
      outputFunction(data);
    } catch (error) {
      console.error("Recording failed:", error);
      outputFunction("");
    }
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
