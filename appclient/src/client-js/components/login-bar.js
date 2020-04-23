import React, { Component } from 'react'

export default class LoginBar extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            if this.props.user
                .login-bar
                    p="logged in as "
                        strong=this.props.user.username
                        a(href="lobby.html") lobby
                        a(href="#",onClick=this.props.logout) logout
        `
    }
}
