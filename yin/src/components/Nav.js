import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import hamburger from "../assets/images/hamburger.svg";
import whiteHamburger from "../assets/images/whiteHamburger.svg";
import LanguageContext from "../context/LanguageContext";

function Nav({ isLoggedIn, isTeacher, username, logout, activeLang }) {
  const [open, setOpen] = useState(false);
  const { setActiveLang } = useContext(LanguageContext);

  const location = useLocation();
  const isLessonsSubpage = location.pathname.split("/").length === 4;

  const handleLanguageClick = (newLanguage) => {
    setActiveLang(newLanguage);
  };

  const openMobileNav = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      openMobileNav();
    }
  };

  return (
    <>
      <nav id="main">
        <ul>
          {isLoggedIn ? (
            <li>
              <Dropdown>
                <Dropdown.Toggle
                  disabled={isLessonsSubpage}
                  variant="success"
                  id="dropdown-basic"
                >
                  {activeLang}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleLanguageClick("mandarin")}
                  >
                    Mandarin
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleLanguageClick("cantonese")}
                  >
                    Cantonese
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          ) : null}
          <li>
            <a id="nav-old-yin" href="/">
              Return to Yin
            </a>
          </li>
          <li>
            <Link to="/lessons/" id="nav-lessons-quizzes">
              Lessons & Quizzes &emsp;|
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <span>
                  Logged in as:
                  {username}
                  &emsp;|
                </span>
              </li>
              <Link to="/logout/" id="logout-link" onClick={logout}>
                {" "}
                Logout
              </Link>
            </>
          ) : (
            <li>
              <Link to="/login/" id="nav-login">
                Login &emsp;|
              </Link>
            </li>
          )}
          {isTeacher && (
            <li>
              <Link to="/teacherInterface/" id="nav-teacher-interface">
                Teachers &emsp;|
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div id="mobile-nav" className={open ? "mobileOpen" : ""}>
        <button
          id="hamburger-icon"
          type="button"
          className="hamburger-button"
          aria-label="Toggle navigation"
          onClick={openMobileNav}
          onKeyPress={handleKeyPress}
        >
          <img
            src={open ? whiteHamburger : hamburger}
            alt="hamburger menu icon"
          />
        </button>
        <div id="mobile-links" className={open ? "mobileOpen" : ""}>
          <Link to="/lessons/" id="nav-mobile-lessons-quizzes">
            Lessons & Quizzes
          </Link>
          {isTeacher && (
            <Link to="/teacherInterface/" id="nav-mobile-teacher-interface">
              Teachers
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <span>
                Logged in as:
                {username}
              </span>
              <Link to="/logout/" id="nav-mobile-logout">
                &mdash; Logout
              </Link>
            </>
          ) : (
            <Link to="/login/" id="nav-mobile-logout">
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

Nav.propTypes = {
  isTeacher: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  activeLang: PropTypes.string.isRequired,
};
export default Nav;
