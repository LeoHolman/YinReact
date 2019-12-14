import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Nav from './components/Nav';
import Activity from './pages/Activity';
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
        <Nav />
        <Switch>
          <Route path="/lesson">
            <div className="lesson-wrap">
            <Lesson lessonOpen={this.state.lessonOpen} toggleLessonActivity={this.toggleLessonActivity}/>
            <Activity number="1" activityOpen={!this.state.lessonOpen} toggleLessonActivity={this.toggleLessonActivity}/>
            </div>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default App;
