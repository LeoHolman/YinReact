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
        const value = target.type === 'checkbox' ? target.checked : target.value;
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
        let formData = new FormData();
        formData.append('word', this.state.word);
        formData.append('alternateTones', this.state.alternateTones);
        formData.append('correct', this.state.correct);
        formData.append('lessonName', this.state.lessonName);
        formData.append('audioFile', document.getElementById("audioFileInput").files[0])
        fetch("/api/uploadAudio/", {
            method: "POST",
            body: formData,
        }).then((response) => {
            console.log(response)
            });
    }

    render() {
        return(
            <>
                <form onSubmit={this.handleSubmit} className ="audioForm">
                    <label for="audioFileInput">
                       Audio File:
                    </label>
                    <input 
                            id="audioFileInput"
                            type="file" 
                            name="audioFile"
                        />
                    <label for ="word">
                        Word:
                    </label>
                    <input 
                            id="word"
                            type="text" 
                            name="word"
                            value={this.state.word}
                            onChange={this.handleInputChange}
                        />
                    <label for="tone">
                        Correct Tone:
                    </label>
                    <input 
                            id="tone"
                            type="text"
                            name="correct"
                            value={this.state.correct}
                            onChange={this.handleInputChange}
                        />
                    <label for="altTone1">
                        Alternate Tone 1:
                    </label>
                        <input
                            id="altTone1"
                            type="text"
                            name="altTone1"
                            value={this.state.alternateTones[0]}
                            onChange={this.createAlternateToneArray}
                        />
                    <label for="altTone2">
                        Alternate Tone 2:
                    </label>
                        <input
                            id="altTone2"
                            type="text"
                            name="altTone2"
                            value={this.state.alternateTones[1]}
                            onChange={this.createAlternateToneArray}
                        />
                    <label for="altTone3">
                        Alternate Tone 3:
                    </label>
                        <input
                            id="altTone3"
                            type="text"
                            name="altTone3"
                            value={this.state.alternateTones[2]}
                            onChange={this.createAlternateToneArray}
                        />
                    <label for="lesson">
                        Lesson Name:
                    </label>
                    <input
                            id="lesson"
                            type="text"
                            name="lessonName"
                            value={this.state.lessonName}
                            onChange={this.handleInputChange}
                        />
                    <label id="submitButton">
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