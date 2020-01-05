import React, { Component } from "react";
import {Redirect} from 'react-router-dom';

class LessonForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            name: props.name || '',
            description: props.description || '',
            words: props.words || [],
            wordKeys: [],
            is_quiz: props.is_quiz || false,
            all_words: [],
            form_complete: false
        }
        console.log(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.fetchAllWords = this.fetchAllWords.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    async componentDidMount(){
        const all_words = await this.fetchAllWords();
        // const {name, description, words, is_quiz, editing} = this.props;
        this.setState({all_words});
        // this.setState({name, description, words, is_quiz, editing});
        // this.setState({name});
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
        const method = this.props.editing ? 'PUT' : 'POST';
        fetch('http://localhost:8000/lessons/add',{
            method: method,
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
                {this.state.form_complete ?
                    <Redirect to='/teacherInterface/' />
                :
                    <>
                        {this.props.editing ?
                         <h1>Editing {this.props.name}</h1>
                        :
                         <h1>New lesson</h1>}
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="name">
                                Name:
                            </label>
                                <input 
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                />
                            <label htmlFor="description">
                                Description:
                            </label>
                                <input 
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleInputChange}
                                />
                            <label htmlFor="words">
                                Words
                            </label>
                                <select
                                    id="words"
                                    multiple={true}
                                    name="words"
                                    value={this.state.words}
                                    onChange={this.handleSelectChange}
                                >
                                    {this.state.all_words && this.state.all_words.map( (word) => {
                                        return <option key={word._id} id={word._id} value={word.character}>{word.character}</option>
                                    })}
                                </select>
                            <label htmlFor="is_quiz">
                                Is this lesson a quiz?:
                            </label>
                                <input 
                                    id="is_quiz"
                                    checked={!!this.state.is_quiz}
                                    type="checkbox"
                                    name="is_quiz"
                                    value={this.state.is_quiz}
                                    onChange={this.handleCheckboxChange}
                                />
                            <input type="submit" value="Submit" />
                        </form>
                    </>
                }
            </>
        )
    }
}

export default LessonForm;