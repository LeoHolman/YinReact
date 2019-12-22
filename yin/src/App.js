import React from 'react';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/style.css';
import './css/lessons.css';
// import Activity from './pages/Activity';
// import ActivityDirectory from './pages/ActivityDirectory';
// import Answer from './components/Answer';
import BaselineExplanation from './components/BaselineExplanation';
import Header from './components/Header';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Login from './components/Login';
// import Hexagon from './components/Hexagon';
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
        
          {this.state.isLoggedIn ? <> 
            <Switch>
              <Route path="/showLesson/" component={Lesson} />
              <Route path="/lessons/:lessonNumber/:activityNumber" component={Activity} />
              {/* <Route path="/lessons/:lessonNumber/" component={Hexagon} /> */}
              <Route path="/lessons/" component={LessonDirectory} />
              <Route path="/" component={Home} />
              </Switch>
              </>
            :
              <>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="*/explanation">
                  <BaselineExplanation/>
                </Route>
                <Route exact path="/*">
                  <Login submitForm={this.submitForm} />
                </Route>
              </Switch>
              </>
          }
      </Router>
    );
  }
}
export default App;
