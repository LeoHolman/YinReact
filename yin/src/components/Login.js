import React, { Component } from 'react';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            'user': {
                number: '',
                audios: []
            }
        };
    }
    async componentDidMount() {
        fetch('http://localhost:8000/login/', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "username":"lLeo",
                    "password":"supersecret"
                }
            )
        }).then( (response) => {
            response.json().then( (user) => {
                this.setState( {'user': user})
            })
        });
        
    }
    render() {
        return(
            <>
                <p>{this.state.user.number}</p>
            </>
        )
    }

}

export default Login;