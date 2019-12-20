import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({currentStimulus: this.state.currentStimulus + 1});
    }

    render(){
        return(
            <div className="activity-wrap two-choice">
                {this.props.stimuli && <div id="stimuli">{this.props.stimuli[this.state.currentStimulus]}</div>}
                <div className = "answers">
                    <Answer number="one" />
                    <Answer number="two" />
                    <button onClick={this.handleClick}>Next</button>
                </div>
            </div>
        )
    }

}


export default TwoChoiceQuiz;