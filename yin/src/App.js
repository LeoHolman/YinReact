import React from 'react';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/style.css';
import './css/lessons.css';
import BaselineExplanation from './components/BaselineExplanation';
import Baseline from './components/Baseline';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './components/Login';
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
    this.state={
      "lessonOpen":true,
      isLoggedIn: false,
      username: '',
      baseline: 0,
      error:""
    }
    this.toggleLessonActivity = this.toggleLessonActivity.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setBaseline = this.setBaseline.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }

  componentDidMount(){
    this.checkLogin()
  }

  toggleLessonActivity(){
    this.setState({lessonOpen: !this.state.lessonOpen});
  }

  setBaseline(value){
    this.setState({baseline: value});
  }

  async checkLogin(){
    const session = await fetch('/api/user/me/');
    if(session.status === 401 || session.status === 404){
      return false;
    } else {
      const username = await session.text()
      const isLoggedIn = true;
      this.setState({username, isLoggedIn});
    }
  }

  submitForm(event, username, password) {
        event.preventDefault();
        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                    "username":username,
                    "password":password
                }
            )
        }).then( (response) => {
            if (response.status ===401){
              this.setState({error:"Username or password is incorrect."});
            }else{
              response.text().then( (token) => {
                this.setState({error:""});
                this.setState( {isLoggedIn: true});
                this.setState( {username: username});
              })
            }
          })
        
    }

  render(){
    return (
      <Router>
      <Header is_teacher={true} />
      
        {this.state.isLoggedIn ? 
          <> 
            <Switch>
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
                  <Login submitForm={this.submitForm} error={this.state.error}/>
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
