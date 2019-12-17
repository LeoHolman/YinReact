import React from 'react';
import logo from './logo.svg';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/LAstyle.css';
import './css/style.css';
import Activity from './pages/Activity';
import Header from './components/Header';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Answer from './components/Answer';
import Login from './components/Login';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component{

  constructor(){
    super();
    this.state={
      "lessonOpen":true
    }
    this.toggleLessonActivity = this.toggleLessonActivity.bind(this);
  }

  toggleLessonActivity(){
    this.setState({lessonOpen: !this.state.lessonOpen});
  }

  render(){
    return (
      <Router>
        <Header />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/activities/:activityNumber/:hello" component={Activity} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default App;
