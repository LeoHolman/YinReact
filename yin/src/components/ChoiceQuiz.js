import React, {Component} from 'react';
import Answer from './Answer';
import FeedbackBox from './FeedbackBox';
import {Link} from 'react-router-dom';
import {arraysAreEqual, checkForArrayInArrayOfArrays} from '../helper/arrayHelpers';

class ChoiceQuiz extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentStimulus: 0,
            options:[], 
            active:[],
            submitted: false,
            answers:[],
            score:0,
            status:"",
            error:"",
            feedback_heading:"",
            feedback:""
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.collectResponse = this.collectResponse.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.reset = this.reset.bind(this);
        this.chooseTones  = this.chooseTones.bind(this);
        this.randomize = this.randomize.bind(this);
        this.displayAnswers = this.displayAnswers.bind(this);
        this.reportScore = this.reportScore.bind(this);
        this.selectRandomOption = this.selectRandomOption.bind(this);
        this.getWrongOption = this.getWrongOption.bind(this);
        this.selectOptions = this.selectOptions.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);

    }

    componentDidMount(){
        if(this.props.stimuli.length > this.state.currentStimulus ){
            this.displayAnswers();
        }
    }

    componentDidUpdate(){
        if(this.props.stimuli.length > this.state.currentStimulus ){
            this.displayAnswers();
        }
    }

    reset(){
        document.getElementById("nextQuestion").classList.add("hide");
        document.getElementById("submitAnswer").classList.remove("hide");
        document.getElementById("feedback-box").style.visibility="hidden";

        var responses = document.getElementsByClassName("response");
        for (var x=0; x<responses.length; x++){
            responses[x].classList.remove("active");
            responses[x].classList.remove("postive");
            responses[x].classList.remove("negative");
        }
        this.setState({'submitted':false});
        this.setState({'options':[]});
        this.setState({'active':""});
    }

    handleClick() {
        this.setState({'currentStimulus': this.state.currentStimulus + 1});
        this.reset();
    }

    handleSubmit(event){
        // if(!Array.isArray(this.state.active) || !this.state.active.length){
        if(this.state.active !== undefined && this.state.active.length !==0){
            this.setState({'submitted':true});
            var responses = document.getElementsByClassName("response");
            for (var x=0; x<responses.length; x++){
                responses[x].classList.remove("active");
            }
    
            if(arraysAreEqual(this.state.active,this.props.stimuli[this.state.currentStimulus].correctTone)){
                document.getElementById(this.state.active).classList.add('positive');
                this.setState({'score':this.state.score+1});
                this.setState({'status':"positive"});
                this.setState({feedback_heading: 'Correct!'});
                this.setState({'feedback':`You selected tone ${this.state.active}, which is the correct answer.`});
            } else{
                document.getElementById(this.state.active).classList.add('negative');
                this.setState({'status':"negative"});
                this.setState({feedback_heading: 'Incorrect.'});
                this.setState({'feedback':`You selected tone ${this.state.active}, when it should've been tone ${this.props.stimuli[this.state.currentStimulus].correctTone}.`});

            }
    
            document.getElementById("nextQuestion").classList.remove("hide");
            document.getElementById("submitAnswer").classList.add("hide");
            document.getElementById("feedback-box").style.visibility="visible";
            this.setState({'error':""});
        }else{
            this.setState({'error':"Please select an option."});
        }
        
    }

    collectResponse(div){
        if(this.state.submitted===false){
            const questionLabel = `question${this.state.currentStimulus}`;
            this.setState({'answers':[questionLabel, div.id ]});
            this.setState({'active': div.id.split(',').map((item) => Number(item))});
            var responses = document.getElementsByClassName("response");
            for (var x=0; x<responses.length; x++){
                responses[x].classList.remove("active");
            }
            div.classList.add("active");
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

    selectRandomOption(inputArr, correctPos){
        let option = [];
        const allPossible = [1,2,3,4]
        let shuffled = this.randomize(allPossible);

        if(inputArr.length === 1){
            if(shuffled[0] === inputArr[0]){
                option.push(shuffled[1])
            } else {
                option.push(shuffled[0]);
            }
        } else {
            for(let i = 0; i < inputArr.length; i++){
                if(i === correctPos){
                    option.push(inputArr[i]);
                } else {
                    if(shuffled[i] === inputArr[i]){
                        if(i === inputArr.length - 1){
                            option.push(shuffled[0])
                        } else {
                            option.push(shuffled[i + 1])
                        }
                    } else {
                        option.push(shuffled[i])
                    }
                }
            }
        }
        return option;
    }

    getWrongOption(correctArr, correctPos, allOptions){
            let newOption = this.selectRandomOption(correctArr, correctPos);
            if(checkForArrayInArrayOfArrays(allOptions,newOption)){
                return this.getWrongOption(correctArr, correctPos, allOptions);
            } else {
                return newOption;
            }
    }

    selectOptions(){
        const correctArr = this.props.stimuli[this.state.currentStimulus].correctTone;
        let allOptions = [];
        allOptions.push(correctArr);
        let incorrectCalls = this.props.choices - 1;
        let correctPos = 0;
        for(let i = 0; i < incorrectCalls; i++){
            let newArr = this.getWrongOption(correctArr, correctPos, allOptions);
            allOptions.push(newArr);
            correctPos++;
            if(correctPos === correctArr.length){
                correctPos = 0;
            }
        }
        if(this.state.options === undefined || this.state.options.length<1){
            var shuffledOptions = this.randomize(allOptions)
            this.setState({options: shuffledOptions});
        }
    }

    chooseTones(correct){

        var optionArr =[];
        var randomArr = [1,2,3,4];
        
        //Two choice quiz needs randomized 
        if(this.props.choices==='2'){
            //randomize the alternate tones 
            randomArr = this.randomize(randomArr);
        
            for (var i=0; i<randomArr.length; i++){
                if (randomArr[i] === correct){
                    optionArr.push(randomArr[i]);
                    randomArr.splice(i, 1); 
                }
            }
            optionArr.push(randomArr[0]);
        } else {
            optionArr = randomArr;
        }
        
        if(this.state.options === undefined || this.state.options.length<1){
            this.setState({'options': optionArr});
        }
    }

    displayAnswers(){
        if(this.state.options === undefined || this.state.options.length<1){
            this.selectOptions();
        } 
    }

    reportScore(){
        this.props.reportScore(this.state.score, this.props.stimuli.length, this.props.choices);
    }

    nextQuestion(){
        this.refs.audio.pause();
        this.refs.audio.load();
        this.handleClick();

    }


    render(){
        return(
            <>
                {this.props.stimuli && 
                    <>
                    { this.props.stimuli.length > this.state.currentStimulus ? 
                    <>
                    <div className="activity-wrap two-choice">
                        <div className="status">
                            <p>Question {this.state.currentStimulus+1} out of {this.props.stimuli.length}</p>
                        </div>
                        <div className="stimuli">
                            <audio controls id = "audio-clip" ref="audio" >
                                <source id="audioSource" src={`/${this.props.stimuli[this.state.currentStimulus].audioFile}`} type="audio/mpeg" />
                                Audio not working!
                            </audio>
                            {/* <p>word:  {this.props.stimuli[this.state.currentStimulus].character}</p> */}
                        
                        </div>
                        <div className = "answers">
                            {this.state.options.map( (opt) => {
                                return <Answer number = {opt} key ={opt} collectResponse={this.collectResponse} />
                            })}
                        </div>
                    </div>
                    <div className="feedbackContainer">
                        <button onClick={this.handleSubmit} id="submitAnswer">Submit</button>
                        <button onClick={this.nextQuestion} className="hide" id="nextQuestion">Next</button>
                        <FeedbackBox status = {this.state.status} heading={this.state.feedback_heading} content={this.state.feedback}/>
                        <p id="error">{this.state.error}</p>
                    </div>
                    </>
                    
                    :
                        <>
                        {this.props.quiz==="true" ?
                            <>
                            <p>You've completed this section of the quiz.</p>
                            <button onClick={this.reportScore}>Continue</button>
                            </>
                        :
                        <div id="score">
                            <h2>Activity complete!</h2>
                            <p>Your score is: {this.state.score} out of {this.props.stimuli.length}</p>
                            <Link to="../">Return to Lessons & Quizzes</Link>
                            {this.props.choices==='2' ? <Link to="./2"><button>Next activity</button></Link>
                            :
                            <Link to="./3"><button>Next activity</button></Link>
                            }
                        </div>
                        }
                        </>
                    }
                </>
            }
        </>
        )
    }

}


export default ChoiceQuiz;