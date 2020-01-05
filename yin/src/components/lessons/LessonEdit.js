import React, { Component } from "react";
import LessonForm from './LessonForm';

class LessonEdit extends Component{
    constructor(props){
        super(props);
        this.state = {
            lesson: {}
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount(){
        const lesson = await (await fetch(`http://localhost:8000/lessons/${this.props.match.params.name}/`)).json();
        this.setState({lesson});
    }

    render(){
        return(
            <>
                <LessonForm name={this.state.lesson.name} description={this.state.lesson.description} words={this.state.lesson.words} is_quiz={this.state.lesson.is_quiz} editing={true} />
            </>
        )
    }
}

export default LessonEdit;