import React, { Component } from 'react';
import AudioUpload from '../components/AudioUpload';
import TeacherNav from '../components/TeacherNav';
import {Switch, Route, Link} from 'react-router-dom';

class TeacherInterface extends Component {


    render(){
        return(
            <Switch>
                {/* <Route to="/teacherInterface/addLesson/" component={} /> */}
                <Route path="/teacherInterface/uploadAudio/" component={AudioUpload} />
                <Route path="/teacherInterface/" component={TeacherNav} />
            </Switch>
        )
    }
}

export default TeacherInterface;