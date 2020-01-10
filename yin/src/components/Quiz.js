import React, {Component} from 'react';
import ChoiceQuiz from './ChoiceQuiz';
import Baseline from './Baseline';
import Mimicking from './Mimicking';

class Quiz extends Component{
    constructor(props){
        super(props)
        this.state = {
            activity1:{
                score: null,
                maxpoints: new Number()
            },
            activity2:{
                score: null,
                maxpoints: new Number()
            },
            activity3:{
                recordings:[]
            },
            activity4:{
                recordings:[]
            },
            current:this.props.activities[0]
        }
        this.captureScore = this.captureScore.bind(this);
        this.advance = this.advance.bind(this);
        this.recordScore = this.recordScore.bind(this);
    }

    async recordScore(){
        var sum_score = null;
        var sum_total_score = null;
        const user_token = localStorage.token;
        if(this.state.activity1.score && this.state.activity2.score){
            sum_score = this.state.activity1.score + this.state.activity2.score;
            sum_total_score = this.state.activity1.max_score + this.state.activity2.max_score;
        } else if(this.state.activity1.score){
            sum_score = this.state.activity1.score;
            sum_total_score = this.state.activity1.max_score;
        } else if (this.state.activity2.score){
            sum_score = this.state.activity2.score;
            sum_total_score = this.state.activity2.max_score;

        }
        var array1 = this.state.activity3.recordings;
        var allRecordings = array1.concat(this.state.activity4.recordings);
        this.props.sendScore(sum_score, sum_total_score, allRecordings);        
    }

    async getEntries(){
        const user_token = localStorage.token;
        var response = await fetch(`http://localhost:8000/quizScores/${user_token}/${this.props.lesson}`, {
            method: 'GET',
            headers: {"Content-Type":"application/json"},
            //FINISH THIS
        });
    }

    advance(num){

        for (var i=num; i<5; i++){
            var next=i+1;
            if (this.includes(next)){
                this.setState({"current":next});
                break;
            }else if (next===5){
                this.setState({"current":5});
                this.recordScore();
            }
        }
        
       
        if(this.state.current ===5){

        }    
  
        

    }

    captureScore(score, max_score, choices){
        const activity = choices==="2" ? "activity1" : "activity2";
        const activitynum = choices==="2" ? 1 : 2;
        this.setState({[activity]:{
            "score": score, 
            "max_score": max_score
        }}, () => {
            this.advance(activitynum);
        });

    }

    includes(num){
        for(var i=0; i<this.props.activities.length; i++){
            if(this.props.activities[i]===num){
                return true;
            }
        }
        return false;
    }
    
    //to-do
    //need to lift state up from quizzes to here; when a quiz is finished, score needs to come up, and current needs to be updated to the next activity in this.props.activities (might not be the next sequentially)

    render(){
        return(
            <>
                {this.props.activities && this.includes(1) && this.state.current===1 ?
                    <ChoiceQuiz stimuli={this.props.stimuli} choices="2" reportScore={this.captureScore} quiz="true"/>
                    :
                    ""
                }
                {this.props.activities && this.includes(2)  && this.state.current===2 ?
                    <ChoiceQuiz stimuli={this.props.stimuli} choices="4" reportScore={this.captureScore} quiz="true"/>
                    :
                    ""
                }
                {this.props.activities && this.includes(3)  && this.state.current===3 ?
                    <p>[Activity 3 goes here]</p>
                    :
                    ""
                }
                {this.props.activities && this.includes(4)  && this.state.current===4 ?
                    <p>[Activity 4 goes here]</p>
                    :
                    ""
                }
                {this.props.activities  && this.state.current===5 ?
                    <p>Thank you for completing this quiz.</p>
                    :
                    ""
                }

            </>
        )
    }

}

export default Quiz;