import React, { Component } from 'react'
import Recorder from './Recorder';
import PitchChart from './PitchChart';
import AudioPlayer from './AudioPlayer';

class Mimicking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: [],
            userDataset: '',
            currentStimuli: 0,
            allowAdvance: false
        }
        this.passDataToState = this.passDataToState.bind(this);
        this.nextWord = this.nextWord.bind(this);
    }

    async uploadRecording(dataset, username){
        const response = await(await fetch('/api/recordings/add/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dataset: dataset})
        })).json();
        console.dir(response);
        const recordingID = response.recording;
        const updatedRecord = [
            ...this.state.record,
            recordingID
        ];
        this.setState({record: updatedRecord});
    }

    passDataToState(dataset){
        this.setState({
            userDataset: dataset,
            allowAdvance: true
        });
    }

    nextWord(){
        if(this.state.allowAdvance){
            this.setState({
                currentStimuli: this.state.currentStimuli + 1,
                userDataset: '',
                allowAdvance: false
            });
            if(this.props.lesson.is_quiz){
                this.uploadRecording(this.state.userDataset);
                this.props.recordingOutput('activity3', this.state.record);
            }
        } else {
            console.log('Please complete the recording first!');
        }
    }

    render(){
        return(
            <>
                {this.props.lesson && this.props.lesson.words && this.props.lesson.words[this.state.currentStimuli] ?
                    <>
                        <AudioPlayer audioFile={`/${this.props.lesson.words[this.state.currentStimuli].audioFile}`} />
                        <p>{this.props.lesson.words[this.state.currentStimuli].character}</p>
                        {this.props.lesson.words[this.state.currentStimuli].native_recording && 
                            <PitchChart dataset={[[String(this.props.lesson.words[this.state.currentStimuli].native_recording.data), 'blue'],[String(this.state.userDataset), 'red']]} />
                        }
                        <Recorder label="Record" outputFunction={this.passDataToState} />
                        <button onClick={this.nextWord}>Next {this.props.lesson.words.length - 1 === this.state.currentStimuli ?
                            "Section"
                            :
                            "Word"
                        }</button>
                    </>
                    :
                    <p>Lesson complete!</p>
                }
            </>
        )
    }
}

export default Mimicking;