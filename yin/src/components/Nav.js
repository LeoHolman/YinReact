import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import hamburger from "../assets/images/hamburger.svg";
import whiteHamburger from "../assets/images/whiteHamburger.svg";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import {userContext} from '../context/userContext.js';
import updateLang from '../App.js';
import LanguageContext from "../context/LanguageContext.js";
import { useLocation } from 'react-router-dom';


const Nav = ({ checkLogin, isLoggedIn, isTeacher, username, logout, activeLang }) => {
  const [open, setOpen] = useState(false);
  //const [activeLang, setActiveLang] = useState('');
  const { setActiveLang, handleLanguageChange } = useContext(LanguageContext);
  
  const location = useLocation();
  const isLessonsSubpage = location.pathname.split('/').length === 4;
  console.log(isLessonsSubpage);

  const handleLanguageClick = (newLanguage) => {
    setActiveLang(newLanguage);
    /**try {
      checkLogin();
      // Handle successful login (e.g., update state, redirect)
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error (e.g., display error message)
    }*/
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
            
          <Dropdown.Toggle disabled={isLessonsSubpage} variant="success" id="dropdown-basic">
            {activeLang}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            
            <Dropdown.Item onClick={() => handleLanguageClick('mandarin')}>Mandarin</Dropdown.Item>
            <Dropdown.Item onClick={() => handleLanguageClick('cantonese')}>Cantonese</Dropdown.Item>
          
          </Dropdown.Menu>
        </Dropdown>
        
        </li>
        
        ):(<></>)}
          <li>
            <a id="nav-old-yin" href="/">
              Return to Yin{" "}
            </a>
          </li>
          <li>
            <Link to="/lessons/" id="nav-lessons-quizzes">
              Lessons & Quizzes &emsp;|
            </Link>
          </li>
          <>
            {isLoggedIn ? (
              <>
                <li>
                  <span>Logged in as: {username}&emsp;|</span>
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
                </Link>{" "}
              </li>
            )}
            {isTeacher && (
              <li>
                <Link to="/teacherInterface/" id="nav-teacher-interface">
                  Teachers &emsp;|
                </Link>
              </li>
            )}
          </>
        </ul>
       
      </nav>
      <div id="mobile-nav" className={open ? "mobileOpen" : ""}>
        <img
          id="hamburger-icon"
          alt="hamburger menu icon"
          src={open ? whiteHamburger : hamburger}
          onClick={openMobileNav}
          onKeyPress={handleKeyPress}
        />
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
              <span>Logged in as: {username}</span>
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
};

Nav.propTypes = {
  isTeacher: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};
export default Nav;
