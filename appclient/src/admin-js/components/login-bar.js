import React, { Component } from 'react'

export default class LoginBar extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            .login-bar
                p="logged in as "
                    strong=this.props.user.username
                    a(href="#",onClick=this.props.logout) logout
        `
    }
}
