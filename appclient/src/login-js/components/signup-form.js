import React, { Component } from 'react'

export default class SignupForm extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            .form-header
                h2 Create New Account
            form.signup-form
                label(for="username") Username:
                input(type="text",name="username",onChange=this.props.onChange,value=this.props.creds.username)
                label(for="pasw") Password:
                input(type="password",name="pasw",autoComplete="on",onChange=this.props.onChange,value=this.props.creds.pasw)
                a.button(href="#",onClick=this.props.signup) Create Account
                p Username is not case sensitive. It can be whatever you want it to be as long as someone else didn't think of it first.
                p Password can not be left blank.
        `
    }
}
