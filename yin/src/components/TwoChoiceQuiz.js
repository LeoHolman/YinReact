import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            filePath: "",
            word: "",
            correctTone: 0,
            alternateTones:[]
        };
        this.handleClick = this.handleClick.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
    }

    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
    }

    collectResponse(event){
        const questionLabel = `question${this.state.currentStimulus}`;
        this.setState({[questionLabel]: event.target.title});
        // this.handleClick();
    }

    nextQuestion(){
        this.handleClick();
    }

    render(){
        return(
            <div className="activity-wrap two-choice">
                {this.props.stimuli && <div className="stimuli">{this.props.stimuli[this.state.currentStimulus]}</div>}
                {this.props.stimuli && 
                    this.props.stimuli.length > this.state.currentStimulus ? 
                        <>
                        <div className = "answers">
                            <Answer number="one" collectResponse={this.collectResponse}/>
                            <Answer number="two" collectResponse={this.collectResponse}/>
                        </div>
                        <button onClick={this.handleClick}>Next</button>
                        </>
                        :
                        <p>All done!</p>
                }
            </div>
        )
    }

}


export default TwoChoiceQuiz;