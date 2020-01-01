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
        // this.componentDidMount  = this.componentDidMount.bind(this);
        this.randomTone  = this.randomTone.bind(this);
        this.randomize = this.randomize.bind(this);
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

    randomize(a){
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    randomTone(stimuli){
        var optionArr =[];
        var randomArr = [];
        var word = [];
        // var count = this.state.optionCount;
        // this.setState({'optionCount': this.state.optionCount++});
        //randomize the alternate tones 
        console.log("before randomize: "+this.props.stimuli[this.state.currentStimulus].alternateTones);
        randomArr = this.randomize(stimuli[this.state.currentStimulus].alternateTones);
        console.log("after randomize: "+randomArr);
        //if all word possibilities were in the randomized array, execute the following
        // for (var i=0; i<randomArr.length; i++){
        //     if (randomArr[i] == this.props.stimuli.correctTone){
        //         word.push(randomArr[i]);
        //         word.push(randomArr[i].charAt(randomArr[i].length-1));
        //         optionArr.push(word);
        //         randomArr = randomArr.splice(i, 1); 
        //         word = [];
        //     }
        // }

        //Push the first entry in the randomized array, whatever it is
        //this assumes the randomized array only holds incorrect options
        word.push(randomArr[0]);
        word.push(randomArr[0].charAt(randomArr[0].length-1));
        optionArr.push(word);
        word = [];

        //Push the correct answer to the array
        word.push(this.props.stimuli[this.state.currentStimulus].word);
        word.push(JSON.stringify(this.props.stimuli[this.state.currentStimulus].correctTone));
        optionArr.push(word);
        word = [];

        //randomize the two options
        optionArr = this.randomize(optionArr);

        // if(stimuli[this.state.currentStimulus]){
        //     word.push(stimuli[this.state.currentStimulus].word);
        //     optionArr.push(word);
        //     word=[];
        //     for (var i=0; i<2; i++){
        //         word.push(stimuli[this.state.currentStimulus].alternateTones[i]);
        //         optionArr.push(word);
        //         word=[];
        //     }
        //     // this.setState({'options': optionArr});
        //     // console.log('in random' + stimuli[this.state.currentStimulus].word);

        // }
        return optionArr;
    }

    displayAnswers(optionArr){
        console.log(optionArr);
        const answers = optionArr.map( (opt) =>
            <Answer number = {opt} key ={opt[1]} collectResponse={this.collectResponse} />
        );
        return (<>{answers}</>);
    }



    // async componentDidMount(){
    //     // await this.props.stimuli; 
    //     // this.randomTone();
    //     // if (this.props.stimuli){
    //     //     this.randomTone();
    //     // }
    //     // this.setState({'stimuli': this.props.stimuli})
    //     // .then( () => {
    //     //     // this.randomTone();
    //     //     console.log(this.state.options);
    //     // });

    // }

    

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
                            {this.displayAnswers(this.randomTone(this.props.stimuli))}
                            {/* <Answer number={this.randomTone(this.props.stimuli, 0)} collectResponse={this.collectResponse} />
                            <Answer number={this.randomTone(this.props.stimuli, 1)} collectResponse={this.collectResponse}/> */}
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