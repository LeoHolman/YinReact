import React, { Component } from 'react';
import LessonDirectoryCard from '../components/LessonDirectoryCard';
// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";
// import Hexagon from '../components/Hexagon';

class LessonDirectory extends Component {
    constructor(props){
        super(props)
        this.state = {
            allLessons: []
        }
    }

    async componentDidMount() {
        fetch('http://localhost:8000/allLessons/')
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({allLessons: result});
                }));
        // console.log(`State: ${this.state.allLessons}`);

    }

    render(){
        return(
            <div>
                <ul>
                    {this.state.allLessons.map( (lesson) => {
                        return <LessonDirectoryCard LessonName={lesson.number} LessonDesc="Description of the Lesson" link={`/lessons/${lesson.number}/`} key={`${lesson._id}`} />
                    })}
                </ul>
                

            </div>
        )
    }
}

export default LessonDirectory;