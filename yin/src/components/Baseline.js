import React, {Component} from 'react';


class Baseline extends Component{
    constructor(props){
        super(props);
        this.setBaseline = this.setBaseline.bind(this);
    }

    setBaseline(){
        this.props.outputFunction(200);
    }

    render() {
        return(
            <div id ="activity-3-baseline">
                <h3>Record Baseline</h3>
                <p>The following activity is designed to help you improve your ability to produce tone by mimicking a native speaker. You'll be given an audio recording of a native speaker saying a word, and asked to record yourself saying the word. You'll be shown the pitch curve of the native speaker, and after you finish your recording, your pitch curve will be placed along side it for your to compare.</p>
                <p>To begin, please press the "Record Baseline" button and say aloud, "This is my normal speaking voice."</p>
                <button id="baseline" onClick={this.setBaseline}>Record Baseline</button><br/><br/>
                <a href="/explanation">Why are we asking you to do this?</a>
            </div>
        )
    }
}

export default Baseline;