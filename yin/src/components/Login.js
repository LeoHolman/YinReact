import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {
                username: ''
            },
            username: '',
            password: ''

        };
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    async componentDidMount() {
        fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "username":"lLeo",
                    "password":"supersecret"
                }
            )
        }).then( (response) => {
            response.json().then( (user) => {
                console.log(user);
                this.setState( {user: user})
            })
        });
        
    }

    handleChange(event, target) {
        this.setState(target, event.target.value);
    }

    submitForm() {

    }
    render() {
        return(
            <>
                <p>Login:</p>
                <form id="loginform"  onSubmit={this.submitForm}>
                    <input id="username" name="username" placeholder="username" value={this.state.value} onChange={e => this.handleChange(e,'username')} />
                    <input id="password" name="password" placeholder="password" value={this.state.value} onChange={e => this.handleChange(e,'password')}/>
                    <input type="submit" value="Submit" />
                </form>
            </>
        )
    }

}

export default Login;