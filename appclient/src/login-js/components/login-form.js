import React, { Component } from 'react'

export default class LoginForm extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            #wrapper
                .form-header
                    h2 Login
                form.login-form
                    label(for="username") Username:
                    input(type="text",name="username",onChange=this.props.onChange,value=this.props.creds.username)
                    label(for="pasw") Password:
                    input(type="password",name="pasw",autoComplete="on",onChange=this.props.onChange,value=this.props.creds.pasw)
                    a.button(href="#",onClick=this.props.login) Login
                    a.button.small(href="#",onClick=e=>{e.preventDefault();this.props.changeView("signup")}) Create New Account
                    a.forgot-password(href="#",onClick=e=>{e.preventDefault();this.props.changeView("getpw")}) Forgot Password
        `
    }
}