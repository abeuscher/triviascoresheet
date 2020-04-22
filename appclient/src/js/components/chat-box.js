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
                        for message in this.props.messages
                        p!=message.sender +": " + msg
                .chat-window
                    textarea(onChange=this.props.updateChat,onSubmit=this.props.sendChat,value=this.props.currentChatMsg)
                    a.small.button(href="#",onClick=this.props.sendChat) send
        `
    }
}
