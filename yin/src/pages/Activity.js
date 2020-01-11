import React, {Component} from 'react';
import ChoiceQuiz from '../components/ChoiceQuiz';
import Baseline from '../components/Baseline';
import Quiz from '../components/Quiz';
import Mimicking from '../components/Mimicking';
import {
    Route,
  } from "react-router-dom";


class Activity extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: [], 
            audioRes: [],
            audios:[],
            audioParse: [],
            userScores:[]
        }
        this.sendScore = this.sendScore.bind(this);
    }

    async componentDidMount() {
        fetch(`http://localhost:8000/lessons/${this.props.match.params.name}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({lesson: result});
                    }
                )
            );

        // fetch(`http://localhost:8000/quizScores/${this.props.user}/${this.props.match.params.name}`)
        //     .then( (response) => response.json()
        //         .then( (result) => {
        //             this.setState({userScores: result});
        //             }
        //         )
        //     );

        fetch(`http://localhost:8000/lessons/${this.props.match.params.name}/words`)
            .then( (response) => response.json()
                .then( (result) => {
                    console.log(result);
                    this.setState({audioRes: result});
                    // var allAudios = [];
                    // var i = 0;
                    // this.state.audioRes.forEach(function(audio){
                    //     allAudios.push([audio._id, "~",audio.audioFile,"~", audio.word,"~", audio.alternateTones,"~", audio.correctTone,"~", audio.lessonName])
                    //     // var oneAudio = {
                    //     //     id: audio._id,
                    //     //     audioFile: audio.audioFile,
                    //     //     word: audio.word,
                    //     //     alternateTones: audio.alternateTones,
                    //     //     correctTone: audio.correctTone,
                    //     //     lessonName: audio.lessonName

                    //     // }
                    //     // console.log(oneAudio);
                    //     // allAudios.push(oneAudio);
                    // })
                    // console.log(allAudios);
                    // this.setState({audios: allAudios})

                    // var tempRes = this.state.audioRes; 
                    // for(var i=0, temp; i <tempRes.length; i++){
                    //     temp = tempRes[i];

                    // }
                    // var parse = JSON.parse(this.state.audioRes);
                    // this.setState({audioParse: parse});
                }
                )
            );
    }

    sendScore(score, sum_total, recordings){
        fetch('http://localhost:8000/quizScores/add/', {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            
            body:JSON.stringify({
                "lesson": this.props.match.params.name,
                "user": this.props.user,
                "score": score,
                "sum_total_score": sum_total,
                "recordings": recordings || ''
            })
        });
    }

    render(){
        return(
            <div /*className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}*/>
                <h3>Lesson: {this.props.match.params.name}</h3>
                <h2>Activity {this.props.match.params.activityNumber}</h2>
               
                <Route path={`/lessons/${this.props.match.params.name}/1`}>
                    <ChoiceQuiz stimuli={this.state.audioRes} choices="2" />
                    {/* <Baseline thing={this.state.audioRes} /> */}
 
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/2`}>
                    <ChoiceQuiz stimuli={this.state.audioRes} choices="4"/>
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/3`}>
                    {this.props.baseline == -1 ?
                        <Mimicking />
                    :
                        <Baseline outputFunction={this.props.setBaseline} />
                    }
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/4`}>
                    <Baseline />
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/quiz`}>
                    <Quiz activities={[1,2]} stimuli={this.state.audioRes} lesson = {this.state.lesson.name} username={this.props.user} sendScore={this.sendScore}/>
                </Route>


            </div>
        )
    }
}

export default Activity;