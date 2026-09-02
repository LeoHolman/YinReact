import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./css/activities.css";
import "./css/LADirectoryStyle.css";
import "./css/style.css";
import "./css/lessons.css";
import "./helper/navigation";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BaselineExplanation from "./components/BaselineExplanation";
import Baseline from "./components/Baseline";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./components/Login";
import LessonDirectory from "./pages/LessonDirectory";
import Activity from "./pages/Activity";
import TeacherInterface from "./pages/TeacherInterface";
import SignUp from "./pages/SignUp";
import { userContext as UserContext } from "./context/userContext";
import LanguageContext from "./context/LanguageContext";

function App() {
  const [activeLang, setActiveLang] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [baseline, setBaseline] = useState(0);
  const [isTeacher, setIsTeacher] = useState(false);
  const [error, setError] = useState("");

  const contextValue = useMemo(
    () => ({
      activeLang,
      setActiveLang,
    }),
    [activeLang]
  );

  const updateLanguageInDatabase = useCallback(async (value) => {
    await fetch("/api/user/activeLang/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        activeLang: value,
      }),
    });
  }, []);

  const checkLogin = useCallback(async () => {
    const session = await fetch("/api/user/me/", {
      credentials: "include",
    });
    if (session.status === 401 || session.status === 404) {
      setIsLoggedIn(false);
      return false;
    }

    const userdata = await session.json();
    const isTeacherValue = userdata.is_teacher;
    const usernameValue = userdata.username;
    const userLang = userdata.activeLang;
    const baselineNumber = Number(userdata.baseline);
    setUsername(usernameValue);
    setActiveLang(userLang || "");
    setIsLoggedIn(true);
    setBaseline(baselineNumber);
    setIsTeacher(isTeacherValue);
    return true;
  }, []);

  const submitForm = useCallback(
    (event, usernameValue, password) => {
      event.preventDefault();
      fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: usernameValue,
          password,
        }),
      }).then(async (response) => {
        if (response.status === 401) {
          setError("Username or password is incorrect.");
          return;
        }

        setError("");
        setUsername(usernameValue);
        const loggedIn = await checkLogin();
        if (loggedIn) {
          setIsLoggedIn(true);
        }
      });
    },
    [checkLogin]
  );

  const storeBaseline = useCallback(async (value) => {
    setBaseline(value);
    await fetch("/api/user/baseline/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        baseline: value,
      }),
    });
  }, []);

  const renderActivity = useCallback(
    ({ match, location, history }) => (
      <Activity
        activeLang={activeLang}
        baseline={baseline}
        history={history}
        location={location}
        match={match}
        setBaseline={storeBaseline}
        user={username}
      />
    ),
    [activeLang, baseline, storeBaseline, username]
  );

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (activeLang !== "") {
      updateLanguageInDatabase(activeLang);
    }
  }, [activeLang, updateLanguageInDatabase]);

  return (
    <LanguageContext.Provider value={contextValue}>
      <UserContext.Provider value={activeLang}>
        <Router>
          <Header
            checkLogin={checkLogin}
            isTeacher={isTeacher}
            isLoggedIn={isLoggedIn}
            username={username}
            setLoggedIn={setIsLoggedIn}
            activeLang={activeLang}
          />
          {isLoggedIn ? (
            <Switch>
              <Route path="/baseline/" component={Baseline} />
              {isTeacher && (
                <Route path="/teacherInterface/" component={TeacherInterface} />
              )}
              <Route
                path="/lessons/:name/:activityNumber"
                render={renderActivity}
              />
              {/* <Route path="/lessons/:name/" component={LessonShow} /> */}
              <Route path="/lessons/" component={LessonDirectory} />
              <Route path="/" component={Home} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/SignUp">
                <SignUp />
              </Route>
              {/* <Route exact path="/logout">{this.logOut}</Route> */}
              <Route exact path="*/explanation">
                <BaselineExplanation />
              </Route>
              <Route exact path="/*">
                <Login submitForm={submitForm} parentError={error} />
              </Route>
            </Switch>
          )}
          <Footer />
        </Router>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
