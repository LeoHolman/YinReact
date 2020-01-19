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

    uploadRecording(dataset, username){
        fetch('/api/recordings/add/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, dataset})
        }).then( (res) => {
            console.log(`${res.statusText}`)
        });
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
            })
        } else {
            console.log('Please complete the recording first!');
        }
    }

    render(){
        return(
            <>
                {this.props.lesson.words[this.state.currentStimuli] ?
                    <>
                        {this.state.allowAdvance ?
                            <AudioPlayer audioFile={`/api/${this.props.lesson.words[this.state.currentStimuli].audioFile}`} />
                        :
                            <></>
                        }
                        <p>{this.props.lesson.words[this.state.currentStimuli].character}</p>
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
                    <p>Lesson complete!</p>
                }
            </>
        )
    }
}

export default Mimicking;