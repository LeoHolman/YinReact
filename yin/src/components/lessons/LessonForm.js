import React, { Component } from "react";

class LessonForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            description: '',
            words: [],
            is_quiz: false,
            all_words: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.fetchAllWords = this.fetchAllWords.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    async componentDidMount(){
        this.fetchAllWords();
        this.setState({}); 
    }

    async fetchAllWords(){
        const all_words = await (await fetch('http://localhost:8000/words/all/')).json();
        this.setState({all_words})
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
        for(let i = 0; i < options.length; i++){
            if(options[i].selected){
                selected.push(options[i].value);
            }
        }
        this.setState({words:selected});
    }

    handleSubmit(){

    }

    render(){
        return(
            <>
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
                                        return <option key={word._id} value={word.character}>{word.character}</option>
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

                        </form>
                    </>
                }
            </>

        )
    }
}

export default LessonForm;