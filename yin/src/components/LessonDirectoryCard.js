import React, { Component } from 'react';
import {
    Link
  } from "react-router-dom";

class LessonDirectoryCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            activityOpen: false
        }
        this.toggleActivityList = this.toggleActivityList.bind(this);
    }

    toggleActivityList(){
        this.setState({activityOpen: !this.state.activityOpen});
        console.log("anything")
    }

    render(){
        return(
            <div className="lessonCard">
                <div className="meta" onClick={this.toggleActivityList}>
                    <h2>Lesson: {this.props.LessonName}</h2>
                    <p>{this.props.LessonDesc}</p>
                </div>
                <div className = {`sub activityListContainer ${this.state.activityOpen ? '' : 'hide'} `}>
                    <h3>Activities</h3>
                    <ul className="activityList">
                        <li><Link to={`${this.props.link}1`}>1<br /></Link><span>Distinguishing</span></li>
                        <li><Link to={`${this.props.link}2`}>2<br /></Link><span>Identifying</span></li>
                        <li><Link to={`${this.props.link}3`}>3<br /></Link><span>Mimicking</span></li>
                        <li><Link to={`${this.props.link}4`}>4<br /></Link><span>Producing</span></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default LessonDirectoryCard;