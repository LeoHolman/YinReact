import React, { Component } from 'react'
import Recorder from './Recorder';
import PitchChart from './PitchChart';
import AudioPlayer from './AudioPlayer';
import {Link} from 'react-router-dom';


class Production extends Component {
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
        if(this.props.lesson.is_quiz){
            this.uploadRecording(dataset, this.props.username);
        }
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
                this.props.recordingOutput('activity4', this.state.record);
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
                        <p className="stimuliCharacter">{this.props.lesson.words[this.state.currentStimuli].character}</p>

                        {this.state.allowAdvance ?
                            <AudioPlayer audioFile={`/${this.props.lesson.words[this.state.currentStimuli].audioFile}`} />
                        :
                            <></>
                        }
                        <PitchChart 
                            dataset={this.state.allowAdvance ? [
                                [String(this.props.lesson.words[this.state.currentStimuli].native_recording.data), 'blue'],
                                [String(this.state.userDataset), 'red']
                            ]
                            :
                            [
                                [String(this.state.userDataset), 'red']
                            ]
                        }
                        />
                        <Recorder label="Record" outputFunction={this.passDataToState} />
                        <button onClick={this.nextWord}>Next {this.props.lesson.words.length - 1 === this.state.currentStimuli ?
                            "Section"
                            :
                            "Word"
                        }</button>
                    </>
                    :
                    <>
                    {this.props.quiz==="true" ?
                            <>
                                <p>You've completed this section of the quiz.</p>
                                <button onClick={this.props.advance(4)}>Continue</button>
                            </>
                        :
                            <div id="score">
                                <h2>Activity complete!</h2>
                                <Link to="../">Return to Lessons & Quizzes</Link>
                            </div>
                    }
                    </>
                }
            </>
        )
    }
}

export default Production;