import React, { Component } from "react";
import LessonForm from './LessonForm';

class LessonEdit extends Component{
    constructor(props){
        super(props);
        this.state = {
            lesson: {},
            words: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount(){
        const lesson = await (await fetch(`/api/lessons/${this.props.match.params.name}/`)).json();
        this.setState({lesson});

        const words = await(await fetch(`/api/lessons/${this.props.match.params.name}/words/`)).json();
        this.setState({words});
    }

    render(){
        return(
            <>
            {this.state.lesson.name &&
                <LessonForm name={this.state.lesson.name} 
                description={this.state.lesson.description} 
                words={this.state.words} 
                is_quiz={this.state.lesson.is_quiz} 
                editing={true}
                quiz_sections={this.state.lesson.quizSections} />
            }
            </>
        )
    }
}

export default LessonEdit;