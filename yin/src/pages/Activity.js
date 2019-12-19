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
    render(){
        return(
            <div /*className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}*/>
                <h2>Activity {this.props.match.params.lessonNumber}</h2>
                <p>{this.props.match.params.hello}</p>
               
                <Route path={`/activities/${this.props.match.params.activityNumber}/1`}>
                    <TwoChoiceQuiz />
                </Route>
                <Route path={`/activities/${this.props.number}/2`}>
                    <FourChoiceQuiz />
                </Route>


            </div>
        )
    }
}

export default Activity;