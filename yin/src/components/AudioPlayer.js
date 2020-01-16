import React, { Component } from 'react';

class AudioPlayer extends Component {

    render(){
        return(
            <audio controls > 
                <source src={this.props.audioFile} />
                The audio cannot play.
            </audio>
        )
    }
}

export default AudioPlayer;