import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Nav from './Nav.js';
import Logo from '../assets/images/Yin_Classroom_logo@4x.png';
import {useHistory} from "react-router-dom";

function Header({
    isTeacher, 
    isLoggedIn, 
    username, 
    setLoggedIn
}) {

    let history = useHistory();
    function logOut() {
        fetch('/api/logout', {
          method: 'get',
          credentials: 'include', 
          redirect: "follow"
        }).then(res => {
          history.push('/');
          setLoggedIn(false);
        }).catch(err => {
          console.log(err);
        });
      }

    return(
        <div className="header">
            {console.log(isTeacher)}
            <Link to="/"><img src={Logo} id="logo" alt="jojo the monkey walking by the yin logo"/></Link>
            <Nav is_teacher={isTeacher} isLoggedIn={isLoggedIn} username={username} logout={logOut}/>
        </div>
    )

}


export default Header;