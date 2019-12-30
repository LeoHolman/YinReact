import React, { Component } from 'react';

class AudioUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: '',
            alternateTones: [],
            correct: '',
            lessonName: '' 
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createAlternateToneArray = this.createAlternateToneArray.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type == 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]:value
        })
    }

    createAlternateToneArray(){
        const altTone1 = document.getElementById("altTone1").value; 
        const altTone2 = document.getElementById("altTone2").value; 
        const altTone3 = document.getElementById("altTone3").value; 
        this.setState({
            alternateTones: [altTone1, altTone2, altTone3]
        })
    }

    handleSubmit(event){
        event.preventDefault();

        fetch("http://localhost:8000/uploadAudio/", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                audioFile: document.getElementById("audioFileInput").files[0],
                word: this.state.word,
                alternateTones: this.state.alternateTones,
                correct: this.state.correct,
                lessonName: this.state.lessonName
            })
        }).then((response) => {
            console.log(response)
            });
    }

    render() {
        return(
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Audio File:
                        <input 
                            id="audioFileInput"
                            type="file" 
                            name="audioFile"
                        />
                    </label>
                    <br />
                    <label>
                        Word:
                        <input 
                            type="text" 
                            name="word"
                            value={this.state.word}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Correct Tone:
                        <input 
                            type="text"
                            name="correct"
                            value={this.state.correct}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Alternate Tone 1:
                        <input
                            id="altTone1"
                            type="text"
                            name="altTone1"
                            value={this.state.alternateTones[0]}
                            onChange={this.createAlternateToneArray}
                        />
                    </label>
                    <br />
                    <label>
                        Alternate Tone 2:
                        <input
                            id="altTone2"
                            type="text"
                            name="altTone2"
                            value={this.state.alternateTones[1]}
                            onChange={this.createAlternateToneArray}
                        />
                    </label>
                    <br />
                    <label>
                        Alternate Tone 3:
                        <input
                            id="altTone3"
                            type="text"
                            name="altTone3"
                            value={this.state.alternateTones[2]}
                            onChange={this.createAlternateToneArray}
                        />
                    </label>
                    <br />
                    <label>
                        Lesson Name:
                        <input
                            type="text"
                            name="lessonName"
                            value={this.state.lessonName}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </label>

                </form>

            </>
        )
    }
}

export default AudioUpload;