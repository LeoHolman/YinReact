import React, { Component } from 'react'
import Recorder from './Recorder';
import PitchChart from './PitchChart';

class Mimicking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: [],
            userDataset: ''
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

    componentDidMount(){
    }

    passDataToState(dataset){
        this.setState({userDataset: dataset});
    }

    render(){
        return(
            
            <>
                <PitchChart dataset={this.state.userDataset} />
                <Recorder outputFunction={this.passDataToState} />
            </>
        )
    }
}

export default Mimicking;