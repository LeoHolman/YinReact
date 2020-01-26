import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class Nav extends Component {
    render(){
        return(
            <nav>
                <ul>
                    <li><a href="https://yin.rit.edu">Return to Yin </a></li>
                    <li><Link to="/lessons/">Lessons & Quizzes &emsp;|</Link></li>
                    <li><Link to="/login/">Login &emsp;|</Link> </li>
                    {/* {this.props.is_teacher &&
                        <li><Link to="/teacherInterface/">Teachers &emsp;|</Link></li>} */}
                </ul>
            </nav>
        )
    }
}

export default Nav;