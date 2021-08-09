import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import Recorder from "./Recorder";

const Baseline = ({ outputFunction }) => {
  // constructor(props){
  //     super(props);
  //     this.setBaseline = this.setBaseline.bind(this);
  // }

  function extractAverage(dataset) {
    const parsedData = d3.tsvParse(dataset);
    const data = parsedData.map((__data) => {
      return Number(__data.frequency);
    });

    const baseline =
      data.reduce((acc, number) => acc + number, 0) / data.length;
    return baseline;
  }

  function setBaseline(dataset) {
    const baseline = extractAverage(dataset);
    outputFunction(baseline);
  }

  return (
    <div id="activity-3-baseline">
      <h3>Record Baseline</h3>
      <p>
        The following activity is designed to help you improve your ability to
        produce tone by mimicking a native speaker. You'll be given an audio
        recording of a native speaker saying a word, and asked to record
        yourself saying the word. You'll be shown the pitch curve of the native
        speaker, and after you finish your recording, your pitch curve will be
        placed along side it for your to compare.
      </p>
      <p>
        To begin, please press the "Record Baseline" button and say aloud, "This
        is my normal speaking voice."
      </p>
      <Recorder id="baseline" label="Baseline" outputFunction={setBaseline} />
      <p>
        <a href="/explanation">Why are we asking you to do this?</a>
      </p>
    </div>
  );
};

Baseline.propTypes = {
  outputFunction: PropTypes.func.isRequired,
};

export default Baseline;
