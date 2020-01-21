import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';


class SignUp extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            password2: '',
            baseline: null,
            is_teacher: false,
            form_complete: false,
            preventSubmit:false,
            errorMessage:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }


    handlePasswordChange(){
        // var attribute = event.target.name;
        // var value = event.target.value;
        if(this.state.password !== this.state.password2){
            console.log("error");
            this.setState({"errorMessage": "Your passwords do not match."})
            this.setState({"preventSubmit": true});
        }else if(this.state.password===this.state.password2){
            console.log("match");
            this.setState({"errorMessage": ""})
            this.setState({"preventSubmit": false});
        }

        // this.setState({[attribute]: value})
    }


    async handleInputChange(event){
        var attribute = event.target.name;
        var value = event.target.value;
        this.setState({[attribute]: value}, () =>{
            if (attribute === "password" || attribute ==="password2"){
                this.handlePasswordChange();
            }
        });

    }

    handleCheckboxChange(){
        var prevState = this.state.is_teacher;
        this.setState({is_teacher: !prevState})
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.preventSubmit === false){
            const method = this.props.editing ? 'PUT' : 'POST';
            fetch('/api/signup/',{
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    baseline: this.state.baseline,
                    is_teacher: this.state.is_teacher
                })
            }).then( async (response) => {
                const message = await response.text();
                if (message ==="Username taken, please try another."){
                    this.setState({"errorMessage": message})
                }else{
                    this.setState({form_complete: true})
                }
                
            });
        } else if(this.state.preventSubmit===true){
            this.setState({"errorMessage": this.state.errorMessage + "  Please correct errors before submitting."})
        }
    }


    render(){
        return(
            <>
                {this.state.form_complete ?
                    <Redirect to='/' />
                :
                    <>
                    <form id="signUp" onSubmit={this.handleSubmit}>
                        <h2>Sign Up</h2>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="password2">Re-enter password:</label>
                        <input
                            id="password2"
                            type="password"
                            name="password2"
                            value={this.state.password2}
                            onChange={this.handleInputChange}
                        />
                        {/* <label htmlFor="is_teacher">Check this box if you are a teacher.</label>
                        <input
                            id="is_teacher"
                            type="checkbox"
                            checked={!!this.state.is_teacher}
                            name="is_teacher"
                            value={this.state.is_teacher}
                            onChange={this.handleCheckboxChange}
                        /> */}
                        <p id="error">{this.state.errorMessage}</p>
                        <input type="submit" value="Submit" />
                        <p>If you are a teacher, please <a href="mailto:yinwebapp@gmail.com">contact us</a> for special permissions.</p>

                    </form>
                    
                    </>}
                
            </>
        )
    }
}

export default SignUp;