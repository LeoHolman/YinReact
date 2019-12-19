import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    render(){
        return(
            <div className="activity-wrap two-choice">
                <div id="stimuli">{this.props.stimuli}</div>
                <div className = "answers">
                    <Answer number="one" />
                    <Answer number="two" />
                </div>
            </div>
        )
    }

}


export default TwoChoiceQuiz;