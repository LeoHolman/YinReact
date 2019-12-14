import React, {Component} from 'react';


class Activity extends Component{
    render(){
        return(
            <div className={`activity ${this.props.activityOpen ? 'open' : 'min'}`} onClick={this.props.toggleLessonActivity}>
                <h2>Activity {this.props.number}</h2>
            </div>
        )
    }
}

export default Activity;