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
    }

    render(){
        return(
            <div className="lessonCard">
                {this.props.is_quiz ?
                    <Link to={`${this.props.link}quiz`} style={{ textDecoration: 'none' }}>
                        <div className="meta quiz" onClick={this.toggleActivityList} >
                            <h2><span id="no-underline">Quiz: {this.props.LessonName}</span></h2>
                            <p>{this.props.LessonDesc}</p>
                        </div>
                    </Link>
                :
                    <>
                        <div className="meta" onClick={this.toggleActivityList} >
                            <h2>{this.props.is_quiz ? 'Quiz: ' : 'Lesson: '}{this.props.LessonName}</h2>
                            <p>{this.props.LessonDesc}</p>
                        </div>
                        <div className = {`sub activityListContainer ${this.state.activityOpen ? '' : 'hide'} `}>
                            <h2>Activities</h2>
                            <ul className="activityList">
                                <li><Link id="link-activity1" to={`${this.props.link}1`}>1<br /></Link><span>Distinguishing</span></li>
                                <li><Link id="link-activity2" to={`${this.props.link}2`}>2<br /></Link><span>Identifying</span></li>
                                <li><Link id="link-activity3" to={`${this.props.link}3`}>3<br /></Link><span>Mimicking</span></li>
                                <li><Link id="link-activity4" to={`${this.props.link}4`}>4<br /></Link><span>Producing</span></li>
                            </ul>
                        </div>
                    </>
                }
                
            </div>
        )
    }
}

export default LessonDirectoryCard;