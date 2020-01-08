import React, { Component } from 'react';

class AudioPlayer extends Component {
    constructor(props){
        super(props);
    }

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