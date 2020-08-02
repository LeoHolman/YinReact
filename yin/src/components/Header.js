import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Nav from './Nav.js';
import Logo from '../assets/images/Yin_Classroom_logo@4x.png';

class Header extends Component{
    render(){
        return(
            <div className="header">
                <Link to="/"><img src={Logo} id="logo" alt="jojo the monkey walking by the yin logo"/></Link>
                <Nav is_teacher={this.props.is_teacher} isLoggedIn={this.props.isLoggedIn} username={this.props.username} logout={this.props.logout}/>
            </div>
        )
    }
}


export default Header;