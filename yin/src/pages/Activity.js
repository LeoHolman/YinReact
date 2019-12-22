import React, {Component} from 'react';
import FourChoiceQuiz from '../components/FourChoiceQuiz';
import TwoChoiceQuiz from '../components/TwoChoiceQuiz';
import Lesson from './Lesson';
import Baseline from '../components/Baseline';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Activity extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: [], 
            audioRes: [],
            audios:[]
        }
    }

    async componentDidMount() {
        fetch(`http://localhost:8000/getLesson/${this.props.match.params.lessonNumber}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({lesson: result});
                    }
                )
            );

        fetch(`http://localhost:8000/getAudio/${this.props.match.params.lessonNumber}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({audioRes: result});
                    console.log(this.state.audios);
                    var allAudios = [];
                    var i = 0;
                    this.state.audioRes.forEach(function(audio){
                        allAudios.push([audio.alternateTones, audio._id, audio.audioFile, audio.word, audio.correctTone, audio.lessonName])
                    })
                    console.log(allAudios);
                    this.setState({audios: allAudios})

                }
                )
            );
    }

    render(){
        return(
            <div /*className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}*/>
                <h3>Lesson: {this.props.match.params.lessonNumber}</h3>
                <h2>Activity {this.props.match.params.activityNumber}</h2>
               
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/1`}>
                    <TwoChoiceQuiz stimuli={this.state.audios}/>
 
                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/2`}>
                    <FourChoiceQuiz stimuli={this.state.lesson.audios}/>
                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/3`}>
                    <Baseline />
                </Route>
                <Route path={`/lessons/${this.props.match.params.lessonNumber}/4`}>
                    <Baseline />
                </Route>


            </div>
        )
    }
}

export default Activity;