import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    render(){
        return(
            <div class="activity-wrap two-choice">
                <div id="stimuli">Audio goes here</div>
                <div class = "answers">
                    <Answer number="one" />
                    <Answer number="two" />
                </div>
            </div>
        )
    }

}


export default TwoChoiceQuiz;