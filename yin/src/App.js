import React from 'react';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/style.css';
import './css/lessons.css';
// import Activity from './pages/Activity';
// import Answer from './components/Answer';
import BaselineExplanation from './components/BaselineExplanation';
import Baseline from './components/Baseline';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Mimicking from './components/Mimicking';
import Login from './components/Login';
// import Hexagon from './components/Hexagon';
import LessonDirectory from './pages/LessonDirectory';
import LessonShow from './components/lessons/LessonShow';
import Activity from './pages/Activity';
import TeacherInterface from './pages/TeacherInterface';
import SignUp from './pages/SignUp';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

class App extends React.Component{

  constructor(){
    super();
    const hasToken = localStorage.token ? true : false;
    this.state={
      "lessonOpen":true,
      isLoggedIn: hasToken,
      username: '',
      baseline: 0
    }
    this.toggleLessonActivity = this.toggleLessonActivity.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setBaseline = this.setBaseline.bind(this);
  }

  componentDidMount(){
    window.addEventListener("beforeunload", (ev) =>{
      ev.preventDefault();
      localStorage.clear();
    });
  }

  toggleLessonActivity(){
    this.setState({lessonOpen: !this.state.lessonOpen});
  }

  setBaseline(value){
    this.setState({baseline: value});
  }

  submitForm(event, username, password) {
        event.preventDefault();
        fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "username":username,
                    "password":password
                }
            )
        }).then( (response) => {
            response.text().then( (token) => {
                this.setState( {isLoggedIn: true});
                localStorage.setItem('token', token);
                this.setState( {username: username});
            })
        });
    }

  render(){
    return (
      <Router>
        <Header is_teacher={true} />
        
          {this.state.isLoggedIn ? <> 
              <Switch>
                <Route path="/showLesson/" component={Mimicking} />
                <Route path="/baseline/" component={Baseline} />
                <Route path="/teacherInterface/" component={TeacherInterface} />
                <Route path="/lessons/:name/:activityNumber" render={(props) => <Activity baseline={this.state.baseline} {...props} setBaseline={this.setBaseline} user={this.state.username} />} />
                <Route path="/lessons/:name/" component={LessonShow} />
                <Route path="/lessons/" component={LessonDirectory} />
                <Route path="/" component={Home} />
              </Switch>
            </>
            :
              <>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/SignUp">
                    <SignUp />
                  </Route>
                  <Route exact path="*/explanation">
                    <BaselineExplanation/>
                  </Route>
                  <Route exact path="/*">
                    <Login submitForm={this.submitForm} />
                  </Route>
                </Switch>
              </>
          }
        <Footer />
      </Router>
    );
  }
}
export default App;
