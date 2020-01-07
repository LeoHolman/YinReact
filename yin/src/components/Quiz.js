import React, {Component} from 'react';
import ChoiceQuiz from './ChoiceQuiz';
import Baseline from './Baseline';
import Mimicking from './Mimicking';

class Quiz extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: [],
            activity1:[],
            activity2:[],
            activity3:[],
            activity4:[],
            current:this.props.activities[0]
        }
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
                    <ChoiceQuiz stimuli={this.props.stimuli} choices="2"/>
                    :
                    ""
                }
                {this.props.activities && this.includes(2)  && this.state.current===2 ?
                    <ChoiceQuiz stimuli={this.props.stimuli} choices="4"/>
                    :
                    ""
                }
                {this.props.activities && this.includes(3)  && this.state.current===3 ?
                    <p>[Activity 3 goes here]</p>
                    :
                    ""
                }
                {this.props.activities && this.includes(1)  && this.state.current===4 ?
                    <p>[Activity 4 goes here]</p>
                    :
                    ""
                }
            </>
        )
    }

}

export default Quiz;