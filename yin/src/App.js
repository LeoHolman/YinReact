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
  // Link
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
          <Route path="/showLesson/" component={Lesson} />
          {/* <Route path="/activities/:lessonNumber/:activityNumber" component={Activity} /> */}
          <Route path="/lessons/:lessonNumber/:activityNumber" component={Activity} />
          <Route path="/lessons/" component={LessonDirectory} />
          <Route path="/login/" component={Login} />

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default App;
