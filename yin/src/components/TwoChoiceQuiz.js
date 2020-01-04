import React, {Component} from 'react';
import Answer from './Answer';

class TwoChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            options:[], 
            active:"",
            submitted: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.reset = this.reset.bind(this);
        // this.componentDidMount  = this.componentDidMount.bind(this);
        // this.randomTone  = this.randomTone.bind(this);
        // this.randomize = this.randomize.bind(this);
    }



    // static getStateDerivedFromProps(props, state){
    //     return {stimuli: props.stimuli};
    // }
    reset(){
        document.getElementById("nextQuestion").classList.add("hide");
        document.getElementById("submitAnswer").classList.remove("hide");
        var responses = document.getElementsByClassName("response");
        for (var x=0; x<responses.length; x++){
            responses[x].classList.remove("active");
            responses[x].classList.remove("correct");
            responses[x].classList.remove("incorrect");
        }
        this.setState({'submitted':false});
    }


    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
        this.reset();
    }

    handleSubmit(event){
        this.setState({'submitted':true});
        var responses = document.getElementsByClassName("response");
        for (var x=0; x<responses.length; x++){
            responses[x].classList.remove("active");
        }

        if(this.state.active==this.props.stimuli[this.state.currentStimulus].correctTone){
            document.getElementById(this.state.active).classList.add('correct');
        } else{
            document.getElementById(this.state.active).classList.add('incorrect');
        }

        document.getElementById("nextQuestion").classList.remove("hide");
        document.getElementById("submitAnswer").classList.add("hide");
    }

    collectResponse(event){
        if(this.state.submitted==false){
            const questionLabel = `question${this.state.currentStimulus}`;
            this.setState({[questionLabel]: event.target.id});
            this.setState({'active': event.target.id});
            var responses = document.getElementsByClassName("response");
            for (var x=0; x<responses.length; x++){
                responses[x].classList.remove("active");
            }
            event.target.classList.add("active");
        }
    }

    // randomize(a){
    //     var j, x, i;
    //     for (i = a.length - 1; i > 0; i--) {
    //         j = Math.floor(Math.random() * (i + 1));
    //         x = a[i];
    //         a[i] = a[j];
    //         a[j] = x;
    //     }
    //     return a;
    // }

    // randomTone(stimuli){
    //     var optionArr =[];
    //     var randomArr = [];
    //     var word = [];
        
        
    //     //randomize the alternate tones 
    //     randomArr = this.randomize(stimuli[this.state.currentStimulus].alternateTones);
    //     //if all word possibilities were in the randomized array, execute the following
    
    //     // for (var i=0; i<randomArr.length; i++){
    //     //     if (randomArr[i] == this.props.stimuli.correctTone){
    //     //         word.push(randomArr[i]);
    //     //         word.push(randomArr[i].charAt(randomArr[i].length-1));
    //     //         optionArr.push(word);
    //     //         randomArr = randomArr.splice(i, 1); 
    //     //         word = [];
    //     //     }
    //     // }

    //     //Push the first entry in the randomized array, whatever it is
    //     //this assumes the randomized array only holds incorrect options
    //     word.push(randomArr[0]);
    //     word.push(randomArr[0].charAt(randomArr[0].length-1));
    //     optionArr.push(word);
    //     word = [];

    //     //Push the correct answer to the array
    //     word.push(this.props.stimuli[this.state.currentStimulus].word);
    //     word.push(JSON.stringify(this.props.stimuli[this.state.currentStimulus].correctTone));
    //     optionArr.push(word);
    //     word = [];

    //     //randomize the two options
    //     optionArr = this.randomize(optionArr);

    //     // if(stimuli[this.state.currentStimulus]){
    //     //     word.push(stimuli[this.state.currentStimulus].word);
    //     //     optionArr.push(word);
    //     //     word=[];
    //     //     for (var i=0; i<2; i++){
    //     //         word.push(stimuli[this.state.currentStimulus].alternateTones[i]);
    //     //         optionArr.push(word);
    //     //         word=[];
    //     //     }
    //     //     // this.setState({'options': optionArr});
    //     //     // console.log('in random' + stimuli[this.state.currentStimulus].word);

    //     // }
    //     return optionArr;
    // }

    displayAnswers(optionArr){
        console.log(optionArr);
        const answers = optionArr.map( (opt) =>
            <Answer number = {JSON.stringify(opt.correctTone)} key ={opt[1]} collectResponse={this.collectResponse} />
        );
        return (<>{answers}</>);
    }

    // if you need to get it from the end of the pinyin
    // getNumber(word){
    //     var number = word.charAt(word.length-1);
    //     return number;
    // }


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
                        <div className="stimuli">
                            <audio controls id = "audio-clip" >
                                <source id="audioSource" src={this.props.stimuli[this.state.currentStimulus].audioFile} type="audio/mpeg" />
                                Audio not working!
                            </audio>
                            <p>word:  {this.props.stimuli[this.state.currentStimulus].character}</p>
                        
                        </div>
                        <div className = "answers">
                            {this.displayAnswers(this.props.stimuli)}
                            {/* <Answer number={this.randomTone(this.props.stimuli, 0)} collectResponse={this.collectResponse} />
                            <Answer number={this.randomTone(this.props.stimuli, 1)} collectResponse={this.collectResponse}/> */}
                        </div>
                        <button onClick={this.handleSubmit} id="submitAnswer">Submit</button>
                        <button onClick={this.handleClick} className="hide" id="nextQuestion">Next</button>
                        </>
                        :
                        <p>All done!</p>
                }
            </div>
        )
    }

}


export default TwoChoiceQuiz;