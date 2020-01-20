import React, {Component} from 'react';
import ChoiceQuiz from '../components/ChoiceQuiz';
import Baseline from '../components/Baseline';
import Quiz from '../components/Quiz';
import Mimicking from '../components/Mimicking';
import Production from '../components/Production';
import {
    Route,
  } from "react-router-dom";


class Activity extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: {}, 
            audioRes: [],
            audios:[],
            audioParse: [],
            userScores:[]
        }
        this.sendScore = this.sendScore.bind(this);
    }

    async componentDidMount() {
        try{
            const lesson = await (await fetch(`/api/lessons/${this.props.match.params.name}`)).json()
            this.setState({lesson});
        } catch (ex) {
            console.log(ex);
        }
    }

    sendScore(score, sum_total, recordings){
        fetch('/api/quizScores/add/', {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            
            body:JSON.stringify({
                "lesson": this.props.match.params.name,
                "user": this.props.user,
                "score": score,
                "maxScore": sum_total,
                "recordings": recordings || ''
            })
        });
    }

    render(){
        return(
            <div>
                <h3>Lesson: {this.props.match.params.name}</h3>
                <h2>Activity {this.props.match.params.activityNumber}</h2>
               
                <Route path={`/lessons/${this.props.match.params.name}/1`}>
                    <ChoiceQuiz stimuli={this.state.lesson.words} choices="2" />
 
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/2`}>
                    <ChoiceQuiz stimuli={this.state.lesson.words} choices="4"/>
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/3`}>
                    {Boolean(this.props.baseline) === false ?
                        <Baseline outputFunction={this.props.setBaseline} />
                    :
                        <Mimicking lesson={this.state.lesson} />
                    }
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/4`}>
                    {Boolean(this.props.baseline) === false ?
                        <Baseline outputFunction={this.props.setBaseline} />
                    :
                        <Production lesson={this.state.lesson} />
                    }
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/quiz`}>
                    <Quiz activities={this.state.lesson.quizSections} stimuli={this.state.lesson.words} fullLesson={this.state.lesson} username={this.props.user} sendScore={this.sendScore}/>
                </Route>


            </div>
        )
    }
}

export default Activity;