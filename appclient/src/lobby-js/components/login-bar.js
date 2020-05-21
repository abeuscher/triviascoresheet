import React, { Component } from 'react'

export default class LoginBar extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
        if this.props.user
            .login-bar
                nav
                    if this.props.user.admin
                        a(href="admin.html") admin   
                .status
                    p="logged in as "
                        strong=this.props.user.username
                        a(href="#",onClick=this.props.logout) logout
        `
    }
}
