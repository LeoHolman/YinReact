import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/teacherInterface.css';

class TeacherNav extends Component {
    render(){
        return(
            <nav id="teacher-nav">
                <li><Link to="/teacherInterface/editLessons/">Edit Lessons</Link></li>
                <li><Link to="/teacherInterface/addLesson/">Add Lesson</Link></li>
                <li><Link to="/teacherInterface/uploadAudio/">Upload Audio</Link></li>
            </nav>
        )
    }
}

export default TeacherNav;