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
            lesson: {}
        }
        this.passDataToState = this.passDataToState.bind(this);
    }

    simpleLog(input){
        console.log(input);
    }

    uploadRecording(datapayload){
        fetch('http://localhost:8000/recordings/add/', {
            method: "POST",
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datapayload)
        }).then( (res) => {
            console.log(`${res.statusText}`)
        });
        // this.setState({record: datarecord}, () => {
        //     console.log(`${this.state.record}`);
        // });
    }

    async componentDidMount(){
        var lesson = await (await fetch('http://localhost:8000/lessons/newApi/')).json();
        this.setState({lesson});
    }

    passDataToState(dataset){
        this.setState({userDataset: dataset});
    }

    render(){
        return(
            
            <>
                {this.state.lesson._id && 
                    <AudioPlayer audioFile={`http://localhost:8000/${this.state.lesson.words[0].audioFile}`} />
                }
                <PitchChart dataset={this.state.userDataset} />
                <Recorder outputFunction={this.passDataToState} />
            </>
        )
    }
}

export default Mimicking;