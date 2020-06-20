import React, { Component } from 'react';
import TeacherNav from '../TeacherNav';
import AudioPlayer from '../AudioPlayer';
import {Link} from 'react-router-dom';

class WordDirectory extends Component{
    constructor(props){
        super(props);
        this.state = {
            words: []
        }
    }

    async componentDidMount(){
        var words = await (await fetch("/api/words/all/")).json();
        this.setState({words: words});
    }
    
    render() {
        return(
            <>
                <TeacherNav view ="words"/>
                {this.state.words.map((word) => {
                    return <div className="wordCard">
                        <h2>{word.character} ({word.pinyin})</h2>
                        <audio className="stimuliAudio" id="audioPlayer" controls key={word.pinyin}> 
                            <source src={"/" + word.audioFile} />
                            {/* <source src='/test\L01_01.wav' /> */}
                            The audio cannot play.
                        </audio>
                        <p>Correct tone: {word.correctTone}</p>
                        <Link to="#">Delete</Link>
                        
                    </div>
                })}
            </>
        )
    }


}

export default WordDirectory;