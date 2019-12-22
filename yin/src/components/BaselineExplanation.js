import React, {Component} from 'react';


class BaselineExplanation extends Component{
    render(){
        return(
            <div id ="baseline-explanation">
                <p>Since pitch is relative to a speaker's voice, we need to know what your natural voice sounds like so that we can calibrate the curve accoridngly. </p>
            </div>
        )
    }
}

export default BaselineExplanation;