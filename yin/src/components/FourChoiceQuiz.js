import React, {Component} from 'react';
import Answer from './Answer';

class FourChoiceQuiz extends Component {
<<<<<<< HEAD
=======
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
        };
        this.handleClick = this.handleClick.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
    }

    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
    }

    collectResponse(event){
        const questionLabel = `question${this.state.currentStimulus}`;
        console.log(event.target.title);
        this.setState({[questionLabel]: event.target.title});
        this.handleClick();
    }
>>>>>>> b7948eb837e7e8e2a0acd9eaab4cf85f7800707e

    render(){
        return(
            <div className="activity-wrap four-choice">
                {this.props.stimuli && <div id="stimuli">{this.props.stimuli[this.state.currentStimulus]}</div>}
                {this.props.stimuli && 
                    this.props.stimuli.length > this.state.currentStimulus ? 
                        <div className = "answers">
                            <Answer number="one" collectResponse={this.collectResponse}/>
                            <Answer number="two" collectResponse={this.collectResponse}/>
                            <Answer number="three" collectResponse={this.collectResponse}/>
                            <Answer number="four" collectResponse={this.collectResponse}/>
                        </div>
                        :
                        <p>All done!</p>
                }
            </div>
        )
    }

}


export default FourChoiceQuiz;