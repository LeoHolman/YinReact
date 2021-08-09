import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import {Link} from 'react-router-dom';
import "../css/login.css";

const Login = ({ submitForm, parentError }) => {
  const [fUsername, setFUsername] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = document.getElementById("username");
    const pass = document.getElementById("password");
    if (user) {
      if (user.value !== "") {
        setFUsername(user.value);
      }
      if (pass.value !== "") {
        setFPassword(pass.value);
      }
    }
  });

  function handleChange(event, targetFunc) {
    targetFunc(event.target.value);
  }

  function handleForm(event, username, password) {
    event.preventDefault();
    if (username !== "" && password !== "") {
      submitForm(event, username, password);
      setFUsername("");
      setFPassword("");
      setError("");
    } else if (username === "" || password === "") {
      setError("Please fill out all fields.");
    }
  }

  return (
    <>
      <form
        id="loginform"
        onSubmit={(e) => handleForm(e, fUsername, fPassword)}
      >
        <h3>Login</h3>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          placeholder="username"
          type="text"
          value={fUsername}
          onChange={(e) => handleChange(e, setFUsername)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          placeholder="password"
          type="password"
          value={fPassword}
          onChange={(e) => handleChange(e, setFPassword)}
        />
        <input id="submit-button" type="submit" value="Submit" />
        <p>
          {parentError} {error}
        </p>
      </form>
      {/* <Link to="/SignUp">Don't have an account? Sign up.</Link> */}
    </>
  );
};

Login.propTypes = {
  submitForm: PropTypes.func.isRequired,
  parentError: PropTypes.string,
};

Login.defaultProps = {
  parentError: "",
};

export default Login;
