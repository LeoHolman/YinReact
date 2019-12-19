import React from 'react';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/LAstyle.css';
import './css/style.css';
import './css/lessons.css';
// import Activity from './pages/Activity';
// import ActivityDirectory from './pages/ActivityDirectory';
// import Answer from './components/Answer';
import Header from './components/Header';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Login from './components/Login';
import Hexagon from './components/Hexagon';
import LessonDirectory from './pages/LessonDirectory';
import Activity from './pages/Activity';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  // Link
} from "react-router-dom";

class App extends React.Component{

  constructor(){
    super();
    this.state={
      "lessonOpen":true,
      isLoggedIn: false,
      username: '',
    }
    this.toggleLessonActivity = this.toggleLessonActivity.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  toggleLessonActivity(){
    this.setState({lessonOpen: !this.state.lessonOpen});
  }

  submitForm(event, username, password) {
        event.preventDefault();
        console.log(username, password);
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
                localStorage.setItem('token', token)
                this.setState( {username: username});
            })
        });
    }

  render(){
    {/* <Route path="/activities/:lessonNumber/:activityNumber" component={Activity} /> */}
    return (
      <Router>
        <Header />
        <Switch>
<<<<<<< HEAD
          {this.state.isLoggedIn ? <> 
              <Route path="/showLesson/" component={Lesson} />
              <Route path="/lessons/:lessonNumber/" component={Hexagon} />
              <Route path="/lessons/" component={LessonDirectory} />
              <Route path="/" component={Home} />
              </>
            :
              <>
                <Route exact path="/" component={Home} />
                <Redirect from="*" to="/login" />
                <Route path="/login">
                  <Login submitForm={this.submitForm} />
                </Route>
              </>
          }
=======
          <Route path="/showLesson/" component={Lesson} />
          {/* <Route path="/activities/:lessonNumber/:activityNumber" component={Activity} /> */}
          <Route path="/lessons/:lessonNumber/:activityNumber" component={Activity} />
          <Route path="/lessons/" component={LessonDirectory} />
          <Route path="/login/" component={Login} />

          <Route path="/">
            <Home />
          </Route>
>>>>>>> 7403f053e52b7389dc6cd3af6c90eb645cac9d95
        </Switch>
      </Router>
    );
  }
}
export default App;
