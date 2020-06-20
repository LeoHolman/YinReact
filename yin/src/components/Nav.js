import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import hamburger from '../assets/images/hamburger.svg';
import whiteHamburger from '../assets/images/whiteHamburger.svg';

class Nav extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false
        }
        this.openMobileNav = this.openMobileNav.bind(this);
    }
    
    openMobileNav(){
        this.state.open ? this.setState({"open":false}) : this.setState({"open":true});
    }

    render(){
        return(
            <>
                <nav id ="main">
                    <ul>
                        <li><a href="https://yin.rit.edu">Return to Yin </a></li>
                        <li><Link to="/lessons/">Lessons & Quizzes &emsp;|</Link></li>
                        <>
                            {this.props.isLoggedIn ? 
                                <li><span>Logged in as: {this.props.username}&emsp;|</span></li>
                            :
                                <li><Link to="/login/">Login &emsp;|</Link> </li>
                            }
                        {this.props.is_teacher &&
                            <li><Link to="/teacherInterface/">Teachers &emsp;|</Link></li>}
                        </>
                    </ul>
                </nav>
                <div id="mobile-nav" className={this.state.open && "mobileOpen"}>
                    <img id="hamburger-icon" src={this.state.open ? whiteHamburger : hamburger} onClick={this.openMobileNav}></img>
                    <div id="mobile-links" className={this.state.open && "mobileOpen"}>
                    <Link to="/lessons/">Lessons & Quizzes</Link>
                    {this.props.is_teacher &&
                        <Link to="/teacherInterface/">Teachers</Link>
                    }
                    {this.props.isLoggedIn ? 
                        <>
                            <span>Logged in as: {this.props.username}</span>
                            <Link to="/logout/" id="logout">&mdash; Logout</Link> 
                        </>
                    :
                        <Link to="/login/">Login</Link> 
                    }
                    </div>
                    
                </div>
            </>
        )
    }
}

export default Nav;