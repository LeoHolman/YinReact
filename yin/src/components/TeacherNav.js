import React from 'react';
import {Link} from 'react-router-dom';
import '../css/teacherInterface.css';

const TeacherNav = ({view}) => {
    return(
        <div id="teacher-nav">
        {view === "lessons" ? 
            <>
                <Link to={'/teacherInterface/lessons/add'} id="addLessonLink">
                        + &emsp;Add a Lesson
                </Link>
                <h1>Lessons | <Link to={'/teacherInterface/words'}>Words </Link></h1>
            </>
        :
            <>
                <Link to={'/teacherInterface/words/add'} id="addLessonLink">
                        + &emsp;Add a Word
                </Link>
                <h1><Link to={'/teacherInterface/lessons'}>Lessons</Link> | Words</h1>
            </>
        }
        </div>
    )
}

export default TeacherNav;