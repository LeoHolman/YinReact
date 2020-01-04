import React, { Component } from "react";
import {Redirect} from 'react-router-dom';

class LessonForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            description: '',
            words: [],
            wordKeys: [],
            is_quiz: false,
            all_words: [],
            form_complete: false
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.fetchAllWords = this.fetchAllWords.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    async componentDidMount(){
        const all_words = await this.fetchAllWords();
        this.setState({all_words})
    }

    async fetchAllWords(){
        const all_words = await (await fetch('http://localhost:8000/words/all/')).json();
        return all_words;
    }

    handleInputChange(event){
        var attribute = event.target.name;
        var value = event.target.value;
        this.setState({[attribute]: value})
    }

    handleCheckboxChange(){
        var prevState = this.state.is_quiz;
        this.setState({is_quiz: !prevState})
    }

    handleSelectChange(event){
        const options = event.target.options;
        var selected = [];
        var selected_keys = [];
        for(let i = 0; i < options.length; i++){
            if(options[i].selected){
                selected.push(options[i].value);
                selected_keys.push(options[i].id);
            }
        }
        this.setState({words:selected});
        this.setState({wordKeys:selected_keys});
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:8000/lessons/add',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name,
                description: this.state.description,
                words: this.state.wordKeys,
                is_quiz: this.state.is_quiz
            })
        }).then( () => {
            this.setState({form_complete: true})
        });
    }

    render(){
        return(
            <>
                {this.state.form_complete &&
                    <Redirect to='/teacherInterface/' />
                }
                {this.props.match.params &&
                    <>
                        {this.props.editing ?
                         <h1>Editing {this.props.name}</h1>
                        :
                         <h1>New lesson</h1>}
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Name:
                                <input 
                                    type="text"
                                    name="name"
                                    value={this.state.number}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Description:
                                <input 
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Words
                                <select
                                    multiple={true}
                                    name="words"
                                    value={this.state.words}
                                    onChange={this.handleSelectChange}
                                >
                                    {this.state.all_words && this.state.all_words.map( (word) => {
                                        return <option key={word._id} id={word._id} value={word.character}>{word.character}</option>
                                    })}
                                </select>
                            </label>
                            <br />
                            <label>
                                Is this lesson a quiz?:
                                <input 
                                    checked={!!this.state.is_quiz}
                                    type="checkbox"
                                    name="is_quiz"
                                    value={this.state.is_quiz}
                                    onChange={this.handleCheckboxChange}
                                />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </>
                }
            </>

        )
    }
}

export default LessonForm;