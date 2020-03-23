import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

class AudioUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pinyin: '',
            character:'',
            // alternateTones: [],
            correct: '',
            form_complete: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        // this.createAlternateToneArray = this.createAlternateToneArray.bind(this);
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

    // createAlternateToneArray(){
    //     const altTone1 = document.getElementById("altTone1").value; 
    //     const altTone2 = document.getElementById("altTone2").value; 
    //     const altTone3 = document.getElementById("altTone3").value; 
    //     this.setState({
    //         alternateTones: [altTone1, altTone2, altTone3]
    //     })
    // }

    handleSubmit(event){
        event.preventDefault();
        let formData = new FormData();
        formData.append('audioFile', document.getElementById("audioFileInput").files[0])
        formData.append('pinyin', this.state.pinyin);
        formData.append('correctTone', this.state.correct);
        formData.append('character', this.state.character);

        // formData.append('alternateTones', this.state.alternateTones);
        fetch("/api/words/add/", {
            method: "POST",
            body: formData,
        }).then((response) => {
            console.log(response)
            });
        this.setState({form_complete:true});
    }

    render() {
        return(
            <>
                {this.state.form_complete ? 
                    <Redirect to='/teacherInterface/words/' />
                :
                
                <form onSubmit={this.handleSubmit} className ="audioForm">
                    <label for="audioFileInput">
                       Audio File:
                    </label>
                    <input 
                            id="audioFileInput"
                            type="file" 
                            name="audioFile"
                        />
                    <label for ="character">
                        Character
                    </label>
                    <input 
                            id="character"
                            type="text" 
                            name="character"
                            value={this.state.character}
                            onChange={this.handleInputChange}
                        />
                    <label for ="pinyin">
                        Pinyin
                    </label>
                    <input 
                            id="pinyin"
                            type="text" 
                            name="pinyin"
                            value={this.state.pinyin}
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
                    <label id="submitButton">
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </label>

                </form>
            }
            </>
        )
    }
}

export default AudioUpload;