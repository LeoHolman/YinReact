import React, {Component} from 'react';
import ChoiceQuiz from './ChoiceQuiz';
import Baseline from './Baseline';
import Mimicking from './Mimicking';

class Quiz extends Component{
    constructor(props){
        super(props)
        this.state = {
            activity1:{
                score: new Number(),
                maxpoints: new Number()
            },
            activity2:{
                score: new Number(),
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
    }

    async sendScore(activity){
        const sum_score = null;
        const sum_total_score = null;
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

        var response = await fetch('http://localhost:8000/quizScores/add/', {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            
            body:{
                "lesson": this.props.lesson,
                "user": user_token,
                "score": sum_score,
                "sum_total_score": sum_total_score,
                "recordings": this.state.recordings || ''
            }
        });
        console.log("response" + response.text());
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
            if (this.includes(i+1)){
                this.setState({"current":i+1});
                break;
            }
        }
        
        if(this.state.current===5){
            this.setState({"current":5});
            this.sendScore();
        }

    }

    captureScore(score, max_score, choices){
        const activity = choices==="2" ? "activity1" : "activity2";
        const activitynum = choices==="2" ? 1 : 2;
        this.setState({[activity]:{
            "score": score, 
            "max_score": max_score
        }});
        this.advance(activitynum);
        console.log("num"+ activitynum);
        console.log("score: "+score);
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