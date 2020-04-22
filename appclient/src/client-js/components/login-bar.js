import React, { Component } from 'react'

export default class ChatBox extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            .chat-widget
                .messages
                    .messages-bucket
                .chat-window
                .app-message
                    p(className=this.props.messages[0].className)=this.props.messages[0].content
        `
    }
}
