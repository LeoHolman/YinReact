import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LessonShow extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson:  {}
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchLesson = this.fetchLesson.bind(this);
    }

    async componentDidMount() {
        if(!!this.state.lesson){
            this.fetchLesson();
        }
    }

    async fetchLesson(){
        const lesson = await (await fetch(`/api/lessons/${this.props.match.params.name}`)).json();
        this.setState({lesson});
    }

    render(){
        return(
            <div className ="lesson show">
                <Link to={`/teacherInterface/lessons/${this.state.lesson.name}/edit/`} key={this.state.lesson.name} className="teacherEditLink">Edit Lesson</Link>
                <h2>{this.state.lesson.name}</h2>
                <h3>Description:</h3>
                <p>{this.state.lesson.description}</p>
                {this.state.lesson.words &&
                    <>
                        <h3>Words:</h3>
                        <ul>
                            {this.state.lesson.words.map( (word) => {
                            return <li key={word._id}>{word.character}</li>
                            })}
                        </ul>
                    </>
                }
                {this.state.lesson.is_quiz ? 
                    <>
                        <p id="is_quiz">This lesson is a quiz, containing the following activities:</p>
                        <ul>
                            {this.state.lesson.quizSections.map( (activity) => {
                                return <li key={activity}>{activity}</li>
                            })}
                        </ul>
                    </>
                :
                    <p>This is a lesson, not a quiz.</p>
                }
            </div>
        )
    }
}

export default LessonShow;