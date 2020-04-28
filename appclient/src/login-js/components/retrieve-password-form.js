import React, { Component } from 'react'

export default class RetrievePasswordForm extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
        .form-header
            h2 Change Password
        form.signup-form
            label(for="username") Username:
            input(type="text",name="username",onChange=this.props.onChange,value=this.props.creds.username)
            label(for="pasw") Password:
            input(type="password",name="pasw",autoComplete="on",onChange=this.props.onChange,value=this.props.creds.pasw)
            label(for="pasw") Password (retype it like you mean it):
            input(type="password",name="pasw2",autoComplete="on",onChange=this.props.onChange,value=this.props.creds.pasw2)
            a.button(href="#",onClick=this.props.resetpw) Reset Password
            p Username is not case sensitive. It can be whatever you want it to be as long as someone else didn't think of it first.
            p Password can not be left blank.
        `
    }
}