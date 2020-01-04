import React, {Component} from 'react';
import FourChoiceQuiz from '../components/FourChoiceQuiz';
import TwoChoiceQuiz from '../components/TwoChoiceQuiz';
import Baseline from '../components/Baseline';
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
            audioParse: []
        }
    }

    async componentDidMount() {
        fetch(`http://localhost:8000/lessons/${this.props.match.params.name}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({lesson: result});
                    }
                )
            );

        fetch(`http://localhost:8000/getAudio/${this.props.match.params.name}`)
            .then( (response) => response.json()
                .then( (result) => {
                    console.log(result);
                    this.setState({audioRes: result});
                    console.log(this.state.audios);
                    var allAudios = [];
                    // var i = 0;
                    console.log(`audio res! ${this.state.audioRes}`);
                    this.state.audioRes.forEach(function(audio){
                        allAudios.push([audio._id, "~",audio.audioFile,"~", audio.word,"~", audio.alternateTones,"~", audio.correctTone,"~", audio.lessonName])
                        // var oneAudio = {
                        //     id: audio._id,
                        //     audioFile: audio.audioFile,
                        //     word: audio.word,
                        //     alternateTones: audio.alternateTones,
                        //     correctTone: audio.correctTone,
                        //     lessonName: audio.lessonName

                        // }
                        // console.log(oneAudio);
                        // allAudios.push(oneAudio);
                    })
                    console.log(allAudios);
                    this.setState({audios: allAudios})

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

    render(){
        return(
            <div /*className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}*/>
                <h3>Lesson: {this.props.match.params.name}</h3>
                <h2>Activity {this.props.match.params.activityNumber}</h2>
               
                <Route path={`/lessons/${this.props.match.params.name}/1`}>
                    <TwoChoiceQuiz stimuli={this.state.audioRes}  />
                    {/* <Baseline thing={this.state.audioRes} /> */}
 
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/2`}>
                    <FourChoiceQuiz stimuli={this.state.lesson.audios}/>
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/3`}>
                    <Baseline />
                </Route>
                <Route path={`/lessons/${this.props.match.params.name}/4`}>
                    <Baseline />
                </Route>


            </div>
        )
    }
}

export default Activity;