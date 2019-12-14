import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class Nav extends Component {
    render(){
        return(
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/lesson">Lesson</Link></li>
                    <li><Link to="/activity">Activity</Link></li>
                </ul>
            </nav>
        )
    }
}

export default Nav;