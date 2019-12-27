import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            stimuli:[]
            // id: props.stimuli,
            // filePath: props.stimuli,
            // word: "",
            // correctTone: 0,
            // alternateTones:[]
        };
        this.handleClick = this.handleClick.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.init= this.init.bind(this);
        this.componentDidMount  = this.componentDidMount.bind(this);

    }

    init() {
        // var index1 = this.props.stimuli.search("~"); 
        // console.log(index1);
    }

    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
        console.log("id:" + this.state.id);
        console.log("File:" + this.state.filePath);
    }

    collectResponse(event){
        const questionLabel = `question${this.state.currentStimulus}`;
        this.setState({[questionLabel]: event.target.title});
        // this.handleClick();
    }

    async componentDidMount(){
        console.log(`stimuli incoming: ${JSON.stringify(this.props.stimuli)}`)
        console.log(`props! ${JSON.stringify(this.props.stimuli[0])}`);
        this.setState({'stimuli': await this.props.stimuli})
        console.log(`props state! ${JSON.stringify(this.state.stimuli[0])}`);
        // var keys = Object.keys(this.props.stimuli[0]);
        // console.log('keys:' + keys)
    }

    nextQuestion(){
        this.handleClick();
    }

    render(){
        return(
            <div className="activity-wrap two-choice">
                {this.props.stimuli[0] && <div className="stimuli">word: {this.props.stimuli[0].word}</div>}
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