import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Nav from './Nav.js';
import Logo from '../assets/images/newLogo1.png';

class Header extends Component{
    render(){
        return(
            <div class="header">
                <Link to="/"><img src={Logo} id="logo"/></Link>
                <Nav />
            </div>
        )
    }
}


export default Header;