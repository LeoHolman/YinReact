import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/login.css';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            fusername: '',
            fpassword: '',
            error:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleForm = this.handleForm.bind(this);
    }

    handleChange(event, target) {
        this.setState({[target]: event.target.value});
    }

    handleForm(event, username, password){
        event.preventDefault();
        if(username !== "" && password !==""){
            this.props.submitForm(event, username, password);
            this.setState( {fusername: '', fpassword: ''});
        }else{
            this.setState({'error':'Please fill out all fields.'});
        }

    }

    render() {
        return(
            <>
                <form id="loginform"  onSubmit={e => this.handleForm(e, this.state.fusername, this.state.fpassword )}>
                    <h3>Login</h3>
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" placeholder="username" type="text" value={this.state.value} onChange={e => this.handleChange(e,'fusername')} />
                    <label htmlFor ="password">Password:</label>
                    <input id="password" name="password" placeholder="password" type="password" value={this.state.value} onChange={e => this.handleChange(e,'fpassword')}/>
                    <input type="submit" value="Submit" />
                    <p>{this.state.error}</p>
                </form>
                <Link to="/SignUp">Don't have an account? Sign up.</Link>
            </>
        )
    }
}

export default Login;