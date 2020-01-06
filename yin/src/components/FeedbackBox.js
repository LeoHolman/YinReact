import React, { Component } from 'react';


class FeedbackBox extends Component{
render(){
    return(
        <div id ="feedback-box" className={`feedbackBox ${this.props.status}`}>
            {this.props.status === "correct" ?
                <p>Correct!</p>
            :
                <p>Incorrect.</p>
            
            }

        </div>
    )
}

}

export default FeedbackBox;