import React, { Component } from 'react';
import AudioUpload from '../components/AudioUpload';
import TeacherNav from '../components/TeacherNav';
import LessonEdit from '../components/LessonEdit';
import {Switch, Route, Link} from 'react-router-dom';
import TeacherLessonDirectory from '../components/TeacherLessonDirectory';

class TeacherInterface extends Component {


    render(){
        return(
            <Switch>
                <Route path="/teacherInterface/editLessons/:lessonnumber" component={LessonEdit} />
                <Route path="/teacherInterface/editLessons/" component={TeacherLessonDirectory} />
                <Route path="/teacherInterface/uploadAudio/" component={AudioUpload} />
                <Route path="/teacherInterface/" component={TeacherNav} />
            </Switch>
        )
    }
}

export default TeacherInterface;