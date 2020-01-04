import React, { Component } from 'react';
import AudioUpload from '../components/AudioUpload';
// import TeacherNav from '../components/TeacherNav';
import LessonForm from '../components/lessons/LessonForm';
import LessonEdit from '../components/lessons/LessonEdit';
import {Switch, Route} from 'react-router-dom';
import TeacherLessonDirectory from '../components/lessons/TeacherLessonDirectory';

class TeacherInterface extends Component {


    render(){
        return(
            <Switch>
                <Route path="/teacherInterface/lessons/:lessonnumber/edit/" component={LessonEdit} />
                <Route path="/teacherInterface/lessons/add/" component={LessonForm} />
                <Route path="/teacherInterface/lessons/" component={TeacherLessonDirectory} />
                <Route path="/teacherInterface/words/add" component={AudioUpload} />
                <Route path="/teacherInterface/" component={TeacherLessonDirectory} />
            </Switch>
        )
    }
}

export default TeacherInterface;