import React, { Component } from 'react';


class FeedbackBox extends Component{
render(){
    return(
        <div id ="feedback-box" className={`feedbackBox ${this.props.status}`}>
            <> 
                <h3>{this.props.heading}</h3>
                <p>{this.props.content}</p>
            </>
                

        </div>
    )
}

}

export default FeedbackBox;