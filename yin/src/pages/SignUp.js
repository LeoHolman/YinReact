import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      password2: "",
      baseline: null,
      isTeacher: false,
      formComplete: false,
      preventSubmit: false,
      errorMessage: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handlePasswordChange() {
    const { password, password2 } = this.state;

    if (password !== password2) {
      this.setState({
        errorMessage: "Your passwords do not match.",
        preventSubmit: true,
      });
    } else {
      this.setState({
        errorMessage: "",
        preventSubmit: false,
      });
    }
  }

  async handleInputChange(event) {
    const attribute = event.target.name;
    const { value } = event.target;
    this.setState({ [attribute]: value }, () => {
      if (attribute === "password" || attribute === "password2") {
        this.handlePasswordChange();
      }
    });
  }

  handleCheckboxChange() {
    this.setState((prevState) => ({ isTeacher: !prevState.isTeacher }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      preventSubmit,
      username,
      password,
      baseline,
      isTeacher,
    } = this.state;
    const { editing } = this.props;

    if (!preventSubmit) {
      const method = editing ? "PUT" : "POST";
      fetch("/api/signup/", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
          baseline,
          is_teacher: isTeacher,
        }),
      }).then(async (response) => {
        const { onSignupSuccess } = this.props;

        if (response.status === 409) {
          const message = await response.text();
          this.setState({ errorMessage: message });
          return;
        }

        if (!response.ok) {
          this.setState({ errorMessage: "Sign up failed. Please try again." });
          return;
        }

        if (onSignupSuccess) {
          await onSignupSuccess();
        }

        sessionStorage.setItem("signupSuccessToast", "1");
        this.setState({ formComplete: true });
      });
    } else {
      this.setState((prevState) => ({
        errorMessage: `${prevState.errorMessage} Please correct errors before submitting.`,
      }));
    }
  }

  render() {
    const {
      formComplete,
      username,
      password,
      password2,
      errorMessage,
    } = this.state;

    if (formComplete) {
      return <Redirect to="/" />;
    }

    return (
      /* eslint-disable jsx-a11y/label-has-associated-control */
      <form id="signUp" onSubmit={this.handleSubmit}>
        <h2>Sign Up</h2>
        <label>
          Username:
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Password:
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Re-enter password:
          <input
            id="password2"
            type="password"
            name="password2"
            value={password2}
            onChange={this.handleInputChange}
          />
        </label>
        <p id="error">{errorMessage}</p>
        <input type="submit" value="Submit" />
        <p>
          If you are a teacher, please
          <a href="mailto:yinwebapp@gmail.com">contact us</a>
          for special permissions.
        </p>
      </form>
    );
  }
}

SignUp.propTypes = {
  editing: PropTypes.bool,
  onSignupSuccess: PropTypes.func,
};

SignUp.defaultProps = {
  editing: false,
  onSignupSuccess: null,
};

export default SignUp;
