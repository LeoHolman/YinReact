import React, { Component } from "react";

class LessonEdit extends Component{
    constructor(props){
        super(props);
        this.state = {
            lesson: {},
            allAudios: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchLesson = this.fetchLesson.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentDidMount(){
        var lesson = await this.fetchLesson(this.props.match.params.lessonnumber);
        this.setState({lesson}); 
        var allAudios = await this.fetchAllAudios();
        this.setState({allAudios});
    }

    async fetchLesson(lessonnumber){
       return (await fetch(`http://localhost:8000/getLesson/${this.props.match.params.lessonnumber}`)).json();
    }

    async fetchAllAudios(){
        return (await fetch('http://localhost:8000/allAudios/')).json();
    }

    handleInputChange(){

    }

    handleSubmit(){

    }

    render(){
        return(
            <>
                {this.props.match.params &&
                    <>
                        <h1>Editing {this.props.match.params.lessonnumber}</h1>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Number:
                                <input 
                                    type="text"
                                    name="number"
                                    value={this.state.lesson.number}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                            <br />
                            <label>
                                Audio Files:
                                <select
                                    multiple="multiple"
                                    name="audios"
                                    value={this.state.lesson.audios}
                                    onChange={this.handleInputChange}
                                >
                                    {this.state.allAudios && this.state.allAudios.map( (audio) => {
                                        return <option value={audio}>{audio}</option>
                                    })}
                                </select>
                            </label>

                        </form>
                    </>
                }
            </>

        )
    }
}

export default LessonEdit;