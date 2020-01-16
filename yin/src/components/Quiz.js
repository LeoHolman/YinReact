import React, {Component} from 'react';
import ChoiceQuiz from './ChoiceQuiz';
import Mimicking from './Mimicking';
import Production from './Production';

class Quiz extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            activity1:{
                score: null,
                maxpoints: 0
            },
            activity2:{
                score: null,
                maxpoints: 0
            },
            activity3:{
                recordings:[]
            },
            activity4:{
                recordings:[]
            },
            current: null,
            // current:0,
            prev: false,
            sum_score: 0,
            sum_total_score: 0
        }
        this.captureScore = this.captureScore.bind(this);
        this.advance = this.advance.bind(this);
        this.recordScore = this.recordScore.bind(this);
        this.initialize= this.initialize.bind(this);
    }

    initialize(){
            if(this.props.activities){
                if(this.state.current===null){
                    this.setState({current:this.props.activities[0]});
                }
            }

            fetch(`http://localhost:8000/quizScores/${this.props.username}/${this.props.lesson}`)
                .then( (response) => response.json()
                    .then( (result) => {
                        console.log("result" + JSON.stringify(result));
                        if(result.length >0){
                            this.setState({prev: true});
                        }
                    }
                )
            )
        
        
    }

    async recordScore(){
        var sum_score = null;
        var sum_total_score = null;
        if(this.includes(1) && this.includes(2)){
            sum_score = this.state.activity1.score + this.state.activity2.score;
            sum_total_score = this.state.activity1.max_score + this.state.activity2.max_score;
        } else if(this.includes(1)){
            sum_score = this.state.activity1.score;
            sum_total_score = this.state.activity1.max_score;
        } else if (this.includes(2)){
            sum_score = this.state.activity2.score;
            sum_total_score = this.state.activity2.max_score;

        }
        this.setState({sum_score:sum_score});
        this.setState({sum_total_score:sum_total_score});
        var array1 = this.state.activity3.recordings;
        var allRecordings = array1.concat(this.state.activity4.recordings);
        this.props.sendScore(sum_score, sum_total_score, allRecordings);        
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
    
    toPercent(num1,num2){
        var percent= num1/num2 *100;
        return percent;
    }
    //to-do
    //need to lift state up from quizzes to here; when a quiz is finished, score needs to come up, and current needs to be updated to the next activity in this.props.activities (might not be the next sequentially)

    render(){
        return(
            <>
                {this.props.lesson && this.state.prev===false ? this.initialize() : ""}
                {this.state.prev===true ? 
                    <>
                        <h3>You've already taken this quiz.</h3>
                        <p>You cannot take a quiz you've already taken. For more practice, explore the lessons. For re-takes, please speak with your teacher.</p>
                    </>
                    :
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
                        <Mimicking lesson={this.props.fullLesson} username={this.props.username} />
                        :
                        ""
                    }
                    {this.props.activities && this.includes(4)  && this.state.current===4 ?
                        <Production lesson={this.props.fullLesson} username={this.props.username} />
                        :
                        ""
                    }
                    {this.props.activities  && this.state.current===5 ?
                        <div id="score">
                        <h3>You've completed this quiz!</h3>
                        <p>Your combined score on the multiple choice sections is {this.state.sum_score} out of {this.state.sum_total_score} ({this.toPercent(this.state.sum_score, this.state.sum_total_score)}%). <br />Your teacher will grade your recordings.</p>
                        </div>
                        :
                        ""
                    }


                    </>
                }
                
            </>
        )
    }

}

export default Quiz;