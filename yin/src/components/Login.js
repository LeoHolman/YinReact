import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            'user': ''
        };
    }
    async componentDidMount() {
        const user = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "username":"lLeo",
                    "password":"supersecret"
                }
            )
        });
        console.log(user.text());
        this.setState( {'user': user.username})
    }
    render() {
        return(
            <>
                <p>{this.state.user}</p>
            </>
        )
    }

}

export default Login;