import React, {Component} from 'react';
import Answer from './Answer';

class FourChoiceQuiz extends Component {
    render(){
        return(
            <div class="activity-wrap four-choice">
                <div id="stimuli">Audio goes here</div>
                <div class = "answers">
                    <Answer number="one" />
                    <Answer number="two" />
                    <Answer number="three" />
                    <Answer number="four" />

                </div>
            </div>
        )
    }

}


export default FourChoiceQuiz;