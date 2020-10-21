import React from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import Nav from "./Nav";
import Logo from "../assets/images/Yin_Classroom_logo@4x.png";

const Header = ({ isTeacher, isLoggedIn, username, setLoggedIn }) => {
  const history = useHistory();
  function logOut() {
    fetch("/api/logout", {
      method: "get",
      credentials: "include",
      redirect: "follow",
    })
      .then(() => {
        history.push("/");
        setLoggedIn(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  return (
    <div className="header">
      <Link to="/">
        <img
          src={Logo}
          id="logo"
          alt="jojo the monkey walking by the yin logo"
        />
      </Link>
      <Nav
        is_teacher={isTeacher}
        isLoggedIn={isLoggedIn}
        username={username}
        logout={logOut}
      />
    </div>
  );
};

Header.propTypes = {
  isTeacher: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};

export default Header;
