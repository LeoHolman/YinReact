import React, { Component } from "react";
import {Redirect} from 'react-router-dom';

class LessonForm extends Component{
    constructor(props){
        super(props);
        // console.log(`some words! ${props.words}`)
        // var startingWords;
        // startingWords = props.words.map((word) => {
        //     console.log(word.character);
        //     return word.character;
        // });
        this.state = {
            name: props.name || '',
            description: props.description || '',
            words: props.words || [],
            wordKeys: [],
            is_quiz: props.is_quiz || false,
            quiz_sections: props.quiz_sections || [1,2,3,4],
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
        this.matchWord = this.matchWord.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.deleteLesson = this.deleteLesson.bind(this);
        this.is_checked = this.is_checked.bind(this);
        this.handleSectionChange = this.handleSectionChange.bind(this);
    }

    async componentDidMount(){
        const all_words = await this.fetchAllWords();
        // const {name, description, words, is_quiz, editing} = this.props;
        this.setState({all_words});
        // this.setState({name, description, words, is_quiz, editing});
        // this.setState({name});
    }

    async fetchAllWords(){
        const all_words = await (await fetch('/api/words/all/')).json();
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

    handleSectionChange(num){
        console.log(this.state.quiz_sections);
        var array = this.state.quiz_sections; 
        var index = null;
        if(this.is_checked(num)){
            index = array.indexOf(num); 
            // delete array[index];
            array.splice(index,1);
        }else{
            array.push(num);
        }


        this.setState({quiz_sections:array});
        

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

    deleteLesson(){
        const method = 'DELETE';
        const url = `/api/lessons/${this.props.name}/delete`;

        fetch(url,{
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name
            })
        }).then( () => {
            console.log("deleted");
        });

    }

    handleSubmit(event){
        console.log("in handle");
        event.preventDefault();
        var method = this.props.editing ? 'PUT' : 'POST';
        var url = '/api/lessons/add/';
        if(this.props.editing && this.state.name ===this.props.name){
            url = `/api/lessons/${this.state.name}/edit`;
        } else if (this.props.editing && this.state.name !== this.props.name){
            this.deleteLesson();
            method = "POST";
        }
        console.log(url);
        fetch(url,{
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name,
                description: this.state.description,
                words: this.state.wordKeys,
                is_quiz: this.state.is_quiz,
                quizSections: this.state.quiz_sections
            })
        }).then( () => {
            console.log("success");
            this.setState({form_complete: true})
        });
    }

    componentDidUpdate(prevProps){
        if(prevProps.words !== this.props.words){
            const newWords = this.props.words.map( (word) => {
                return word.character;
            })
            this.setState({words:newWords});
        }
    }

    matchWord(word){
        for(var i=0; i<this.state.words.length; i++){
            if (this.state.words[i]._id===word){
                console.log(true);
                return true;
                
            }else{
                console.log(false);
                return false;
                
            }
        }

    }


    is_checked(num){
        if(this.props.quiz_sections || this.state.quiz_sections){
            for (var i=0; i<this.state.quiz_sections.length; i++){
                if(this.state.quiz_sections[i]===num){
                    return true;
                }
            }
        }
        return false;
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
                                    size="7"
                                >
                                    {this.state.all_words && this.state.all_words.map( (word) => {
                                        return <option  key={word._id} id={word._id} value={word.character}>{word.character}</option>
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
                            {this.state.is_quiz ? 
                                <>
                                    <h3>Which activities would you like in this quiz?</h3>
                                    <label htmlFor="sec_one">Activity 1: Distinguishing (2-choice quiz)</label>
                                    <input 
                                        id="sec_one"
                                        checked={this.is_checked(1)}
                                        type="checkbox"
                                        name="sec_one"
                                        value="1"
                                        onClick={() => this.handleSectionChange(1)}
                                    />
                                    <label htmlFor="sec_two">Activity 2: Identifying (4-choice quiz)</label>
                                    <input 
                                        id="sec_two"
                                        checked={this.is_checked(2)}
                                        type="checkbox"
                                        name="sec_two"
                                        value="2"
                                        onChange={() => this.handleSectionChange(2)}
                                    />
                                    <label htmlFor="sec_three">Activity 3: Mimicking (record with teacher example)</label>
                                    <input 
                                        id="sec_three"
                                        checked={this.is_checked(3)}
                                        type="checkbox"
                                        name="sec_three"
                                        value="3"
                                        onChange={() => this.handleSectionChange(3)}
                                    />
                                    <label htmlFor="sec_four">Activity 4: Producing (record without teacher example)</label>
                                    <input 
                                        id="sec_four"
                                        checked={this.is_checked(4)}
                                        type="checkbox"
                                        name="sec_four"
                                        value="4"
                                        onChange={() => this.handleSectionChange(4)}
                                    />

                                </>
                                :
                                <>
                                </>
                            }
                            <input type="submit" value="Submit" />
                        </form>
                    </>
                }
            </>
        )
    }
}

export default LessonForm;