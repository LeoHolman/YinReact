import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            options:[]
        };
        this.handleClick = this.handleClick.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.componentDidMount  = this.componentDidMount.bind(this);
        this.randomTone  = this.randomTone.bind(this);
    }

    // static getStateDerivedFromProps(props, state){
    //     return {stimuli: props.stimuli};
    // }

    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
    }

    collectResponse(event){
        const questionLabel = `question${this.state.currentStimulus}`;
        this.setState({[questionLabel]: event.target.title});
    }

   randomTone(stimuli){
        var optionArr =[];
        var word = [];
        if(stimuli[this.state.currentStimulus]){
            word.push(stimuli[this.state.currentStimulus].word);
            optionArr.push(word);
            word=[];
            for (var i=0; i<2; i++){
                word.push(stimuli[this.state.currentStimulus].alternateTones[i]);
                optionArr.push(word);
                word=[];
            }
            // this.setState({'options': optionArr});
            // console.log('in random' + stimuli[this.state.currentStimulus].word);

        }
        return "three";
    }

    async componentDidMount(){
        // await this.props.stimuli; 
        // this.randomTone();
        // if (this.props.stimuli){
        //     this.randomTone();
        // }
        // this.setState({'stimuli': this.props.stimuli})
        // .then( () => {
        //     // this.randomTone();
        //     console.log(this.state.options);
        // });

    }

    

    nextQuestion(){
        this.handleClick();
    }

    render(){
        return(
            <div className="activity-wrap two-choice">
                
                {this.props.stimuli && 
                    this.props.stimuli.length > this.state.currentStimulus ? 
                        <>
                        <div className="stimuli">word: {this.props.stimuli[this.state.currentStimulus].word}</div>
                        <div className = "answers">
                            <Answer number={this.randomTone(this.props.stimuli)} collectResponse={this.collectResponse} />
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