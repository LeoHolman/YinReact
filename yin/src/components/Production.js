import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Recorder from "./Recorder";
import PitchChart from "./PitchChart";
import AudioPlayer from "./AudioPlayer";

const Production = ({ lessonWords, recordingOutput, isQuiz, advance }) => {
  const [record, setRecord] = useState([]);
  const [userDataset, setUserDataset] = useState("");
  const [currentStimuli, setCurrentStimuli] = useState(0);
  const [allowAdvance, setAllowAdvance] = useState(false);

  async function uploadRecording(dataset) {
    // TODO Attach username to recording upload
    const response = await (
      await fetch("/api/recordings/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataset }),
      })
    ).json();
    const recordingID = response.recording;
    const updatedRecord = [...record, recordingID];
    setRecord(updatedRecord);
  }

  function passDataToState(dataset) {
    setUserDataset(dataset);
    setAllowAdvance(true);
    if (isQuiz) {
      uploadRecording(dataset);
    }
  }

  function nextWord() {
    if (allowAdvance) {
      setCurrentStimuli(currentStimuli + 1);
      setUserDataset("");
      setAllowAdvance(false);
      if (isQuiz) {
        uploadRecording(userDataset);
        recordingOutput("activity4", record);
      }
    } else {
      // TODO Add error message, notify user recording was not completed
    }
  }

  return (
    <>
      {lessonWords && lessonWords[currentStimuli] ? (
        <>
          {lessonWords[currentStimuli] && (
            <p className="stimuliCharacter">
              {lessonWords[currentStimuli].character}
            </p>
          )}

          {allowAdvance ? (
            <AudioPlayer
              audioFile={`/${lessonWords[currentStimuli].audioFile}`}
            />
          ) : (
            <></>
          )}
          <PitchChart
            dataset={
              allowAdvance
                ? [
                    [
                      String(lessonWords[currentStimuli].native_recording.data),
                      "blue",
                    ],
                    [String(userDataset), "red"],
                  ]
                : [[String(userDataset), "red"]]
            }
          />
          <Recorder label="Record" outputFunction={passDataToState} />
          <button onClick={nextWord} type="button">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Next{" "}
            {lessonWords.length - 1 === currentStimuli ? "Section" : "Word"}
          </button>
        </>
      ) : (
        <>
          {isQuiz === "true" ? (
            <>
              <p>You've completed section of the quiz.</p>
              <button onClick={advance(4)} type="button">
                Continue
              </button>
            </>
          ) : (
            <div id="score">
              <h2>Activity complete!</h2>
              <Link to="../">Return to Lessons & Quizzes</Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

Production.propTypes = {
  lessonWords: PropTypes.arrayOf(PropTypes.object).isRequired,
  recordingOutput: PropTypes.func.isRequired,
  isQuiz: PropTypes.bool.isRequired,
  advance: PropTypes.func.isRequired,
};

export default Production;
