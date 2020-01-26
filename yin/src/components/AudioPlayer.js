import React, { Component } from 'react';

class AudioPlayer extends Component {

    componentDidUpdate(prevProps){
        if(prevProps.audioFile !== this.props.audioFile){
            document.getElementById('audioPlayer').load();
        }
    }

    render(){
        return(
            <audio className="stimuliAudio" id="audioPlayer" controls > 
                <source src={this.props.audioFile} />
                The audio cannot play.
            </audio>
        )
    }
}

export default AudioPlayer;