import React, {Component} from 'react';
import Answer from './Answer';

class FourChoiceQuiz extends Component {
    render(){
        return(
            <div className="activity-wrap four-choice">
                <div id="stimuli">{this.props.stimuli}</div>
                <div className = "answers">
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