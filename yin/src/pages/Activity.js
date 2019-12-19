import React, {Component} from 'react';
import FourChoiceQuiz from '../components/FourChoiceQuiz';
import TwoChoiceQuiz from '../components/TwoChoiceQuiz';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Activity extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: []
        }
    }

    async componentDidMount() {
        fetch(`http://localhost:8000/getLesson/${this.props.match.params.lessonNumber}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({lesson: result});                }));
        

    }

    render(){
        return(
            <div /*className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}*/>
                <h3>Lesson: {this.props.match.params.lessonNumber}</h3>
                <h2>Activity {this.props.match.params.activityNumber}</h2>
               
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/1`}>
                    <TwoChoiceQuiz stimuli={`${this.state.lesson.audios}`}/>
 
                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/2`}>
                    <FourChoiceQuiz stimuli={`${this.state.lesson.audios}`}/>
                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/3`}>

                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/4`}>

                </Route>


            </div>
        )
    }
}

export default Activity;