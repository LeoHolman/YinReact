import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class Nav extends Component {
    render(){
        return(
            <nav>
                <ul>
                    <li><a href="https://yin.rit.edu">Return to Yin </a></li>
                    <li><Link to="/activities">Activities &emsp;|</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Nav;