import React, { Component } from 'react'

export default class LoginBar extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            .login-bar
                if this.props.user
                    p="logged in as "
                        strong=this.props.user.username
                        if this.props.user.admin
                            a(href="admin.html") admin                        
                        a(href="#",onClick=this.props.logout) logout
        `
    }
}
