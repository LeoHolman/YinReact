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
            <div className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}>
                <h2>Activity {this.props.number}</h2>
                <Route path="/1">
                    <TwoChoiceQuiz />
                </Route>
                <Route path="/2">
                    <FourChoiceQuiz />
                </Route>


            </div>
        )
    }
}

export default Activity;