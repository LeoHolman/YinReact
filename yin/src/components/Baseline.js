import React, {Component} from 'react';
import Recorder from './Recorder';
import * as d3 from 'd3';


class Baseline extends Component{
    constructor(props){
        super(props);
        this.setBaseline = this.setBaseline.bind(this);
    }

    setBaseline(dataset){
        const baseline = this.extractAverage(dataset);
        this.props.outputFunction(baseline);
    }

    extractAverage(dataset){
        const parsedData = d3.tsvParse(dataset);
        const data = parsedData.map( (__data) => {
            return Number(__data.frequency); 
        });

        const baseline = data.reduce((acc, number) => acc + number, 0) / data.length;
        return baseline;
    }

    render() {
        return(
            <div id ="activity-3-baseline">
                <h3>Record Baseline</h3>
                <p>The following activity is designed to help you improve your ability to produce tone by mimicking a native speaker. You'll be given an audio recording of a native speaker saying a word, and asked to record yourself saying the word. You'll be shown the pitch curve of the native speaker, and after you finish your recording, your pitch curve will be placed along side it for your to compare.</p>
                <p>To begin, please press the "Record Baseline" button and say aloud, "This is my normal speaking voice."</p>
                <Recorder id="baseline" label="Baseline" outputFunction={this.setBaseline} />
                <p>
                    <a href="/explanation">Why are we asking you to do this?</a>
                </p>
            </div>
        )
    }
}

export default Baseline;