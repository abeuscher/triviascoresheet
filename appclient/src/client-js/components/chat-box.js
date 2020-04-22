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
                    for message,idx in this.props.messages
                        p(key="chat-message-"+idx,className=message.className)=message.msg
        `
    }
}
