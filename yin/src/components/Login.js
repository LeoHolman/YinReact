import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            fusername: '',
            fpassword: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleForm = this.handleForm.bind(this);
    }

    handleChange(event, target) {
        this.setState({[target]: event.target.value});
    }

    handleForm(event, username, password){
        event.preventDefault();
        this.props.submitForm(event, username, password);
        this.setState( {fusername: '', fpassword: ''});
    }

    render() {
        return(
            <>
                <p>Login:</p>
                <form id="loginform"  onSubmit={e => this.handleForm(e, this.state.fusername, this.state.fpassword )}>
                    <input id="username" name="username" placeholder="username" value={this.state.value} onChange={e => this.handleChange(e,'fusername')} />
                    <input id="password" name="password" placeholder="password" type="password" value={this.state.value} onChange={e => this.handleChange(e,'fpassword')}/>
                    <input type="submit" value="Submit" />
                </form>
            </>
        )
    }
}

export default Login;