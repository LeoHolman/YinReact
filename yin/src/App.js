import React, {useState, useEffect} from 'react';
import './css/activities.css';
import './css/LADirectoryStyle.css';
import './css/style.css';
import './css/lessons.css';
import './helper/navigation.js';
import BaselineExplanation from './components/BaselineExplanation';
import Baseline from './components/Baseline';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './components/Login';
import LessonDirectory from './pages/LessonDirectory';
import Activity from './pages/Activity';
import TeacherInterface from './pages/TeacherInterface';
import SignUp from './pages/SignUp';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  const [lessonOpen, setLessonOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [baseline, setBaseline] = useState(0);
  const [isTeacher, setIsTeacher] = useState(false);
  const [error, setError] = useState('');

  // let history = useHistory();

  useEffect(() =>{
    checkLogin();
  }, []);


  function toggleLessonActivity(){
    setLessonOpen(!lessonOpen);
  }

  async function storeBaseline(value){
    setBaseline(value);
    await fetch('/api/user/baseline/add/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        baseline: value
      })
    });
  }

  async function checkLogin(){
    const session = await fetch('/api/user/me/');
    if(session.status === 401 || session.status === 404){
      return false;
    } else {
      const isLoggedIn = true;
      const userdata = await session.json();
      const isTeacher = userdata.is_teacher;
      const username = userdata.username
      const baseline = Number(userdata.baseline);
      setUsername(username);
      setIsLoggedIn(isLoggedIn);
      setBaseline(baseline);
      setIsTeacher(isTeacher);
    }
  }


  function submitForm(event, username, password) {
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
            if (response.status === 401){
              setError('Username or password is incorrect.');
            }else{
              response.text().then( (token) => {
                setError('');
                setIsLoggedIn(true);
                setUsername(username);
              })
            }
          })
        
    }

  return (
    <Router>
    <Header isTeacher={isTeacher} isLoggedIn={isLoggedIn} username={username} setLoggedIn={setIsLoggedIn} />
    
      {isLoggedIn ? 
        <> 
          <Switch>
            <Route path="/baseline/" component={Baseline} />
            {isTeacher &&
              <Route path="/teacherInterface/" component={TeacherInterface} />
            }
            <Route path="/lessons/:name/:activityNumber" render={(props) => <Activity baseline={baseline} {...props} setBaseline={storeBaseline} user={username} />} />
            {/* <Route path="/lessons/:name/" component={LessonShow} /> */}
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
              {/* <Route exact path="/logout">{this.logOut}</Route> */}
              <Route exact path="*/explanation">
                <BaselineExplanation/>
              </Route>
              <Route exact path="/*">
                <Login submitForm={submitForm} parentError={error} />
              </Route>
            </Switch>
          </>
        }
      <Footer />
    </Router>
  );
}

export default App;
