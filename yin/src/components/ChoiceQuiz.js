import React, {Component} from 'react';
import Answer from './Answer';
import FeedbackBox from './FeedbackBox';

class ChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            options:[], 
            active:"",
            submitted: false,
            answers:[],
            score:0,
            status:""
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.reset = this.reset.bind(this);
        // this.componentDidMount  = this.componentDidMount.bind(this);
        this.chooseTones  = this.chooseTones.bind(this);
        this.randomize = this.randomize.bind(this);
        this.displayAnswers = this.displayAnswers.bind(this);
    }



    // static getStateDerivedFromProps(props, state){
    //     return {stimuli: props.stimuli};
    // }
    reset(){
        document.getElementById("nextQuestion").classList.add("hide");
        document.getElementById("submitAnswer").classList.remove("hide");
        document.getElementById("feedback-box").style.visibility="hidden";


        var responses = document.getElementsByClassName("response");
        for (var x=0; x<responses.length; x++){
            responses[x].classList.remove("active");
            responses[x].classList.remove("correct");
            responses[x].classList.remove("incorrect");
        }
        this.setState({'submitted':false});
        this.setState({'options':[]});
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
            this.setState({'score':this.state.score+1});
            this.setState({'status':"correct"});
        } else{
            document.getElementById(this.state.active).classList.add('incorrect');
            this.setState({'status':"incorrect"});
        }

        document.getElementById("nextQuestion").classList.remove("hide");
        document.getElementById("submitAnswer").classList.add("hide");
        console.log("right before");
        document.getElementById("feedback-box").style.visibility="visible";
        console.log("right after");
    }

    collectResponse(event){
        if(this.state.submitted==false){
            const questionLabel = `question${this.state.currentStimulus}`;
            this.setState({'answers':[questionLabel, event.target.id ]});
            this.setState({'active': event.target.id});
            var responses = document.getElementsByClassName("response");
            for (var x=0; x<responses.length; x++){
                responses[x].classList.remove("active");
            }
            event.target.classList.add("active");
        }
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

    chooseTones(correct){
        var optionArr =[];
        var randomArr = [1,2,3,4];
        //to pair words with tones under their graphs, uncomment word-related code 
        // var word = [];
        
        //Two choice quiz needs randomized 
        if(this.props.choices==2){
            //randomize the alternate tones 
            randomArr = this.randomize(randomArr);
        
            for (var i=0; i<randomArr.length; i++){
                if (randomArr[i] == correct){
                    console.log("correct hit");
                    // word.push(randomArr[i]);
                    // word.push(randomArr[i].charAt(randomArr[i].length-1));
                    optionArr.push(randomArr[i]);
                    randomArr.splice(i, 1); 
                    console.log("after splice "+randomArr);
                    // word = [];
                }
            }
            optionArr.push(randomArr[0]);

            //Push the first entry in the randomized array, whatever it is
            //this assumes the randomized array only holds incorrect options
            // word.push(randomArr[0]);
            // word.push(randomArr[0].charAt(randomArr[0].length-1));
            // optionArr.push(word);
            // word = [];

            // //Push the correct answer to the array
            // word.push(this.props.stimuli[this.state.currentStimulus].word);
            // word.push(JSON.stringify(this.props.stimuli[this.state.currentStimulus].correctTone));
            // optionArr.push(word);
            // word = [];

            // //randomize the two options
            // optionArr = this.randomize(optionArr);

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

            // }``
        } else {
            optionArr = randomArr;
        }
        
        console.log('randomize final options '+optionArr);
        if(this.state.options === undefined || this.state.options == 0){
            this.setState({'options': optionArr});
        }
    }

    displayAnswers(correct){
        this.chooseTones(correct);
        const answers = this.state.options.map( (opt) =>
            <Answer number = {JSON.stringify(opt)} key ={opt[1]} collectResponse={this.collectResponse} />
        );
        return (<>{answers}</>);
    }

    // if you need to get it from the end of the pinyin
    // getNumber(word){
    //     var number = word.charAt(word.length-1);
    //     return number;
    // }
 
    

    nextQuestion(){
        this.handleClick();
    }

    render(){
        return(
            <>
            
                
                {this.props.stimuli && 
                    this.props.stimuli.length > this.state.currentStimulus ? 
                    <>
                    <div className="activity-wrap two-choice">
                        <div className="stimuli">
                            <audio controls id = "audio-clip" >
                                <source id="audioSource" src={this.props.stimuli[this.state.currentStimulus].audioFile} type="audio/mpeg" />
                                Audio not working!
                            </audio>
                            <p>word:  {this.props.stimuli[this.state.currentStimulus].character}</p>
                        
                        </div>
                        <div className = "answers">
                            {this.displayAnswers(this.props.stimuli[this.state.currentStimulus].correctTone)}
                        </div>
                    </div>
                    <div className="feedbackContainer">
                        <button onClick={this.handleSubmit} id="submitAnswer">Submit</button>
                        <button onClick={this.handleClick} className="hide" id="nextQuestion">Next</button>
                        <FeedbackBox status = {this.state.status} />
                    </div>
                    </>
                    
                        :
                        <p>Your score is: {this.state.score}</p>
                }
            </>
        )
    }

}


export default ChoiceQuiz;