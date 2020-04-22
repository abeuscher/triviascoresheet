import React, { Component } from 'react'

export default class ChatBox extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            .chat-widget
                .box.chat-window
                    textarea(value=this.props.messages.current_message,onChange=this.props.changeMessage)
                    button.button(onClick=this.props.messageHost) Send to Player chat
                    button.button(onClick=this.props.messagePlayers) Send to Host
                .box.app-message
                    for message,idx in this.props.messages.app
                        p(key="chat-message-"+idx,className=message.className)=message.msg
                .box.host-message
                    for message,idx in this.props.messages.host
                        p(key="host-message-"+idx,className=message.className)=message.msg   
                .box.player-message
                    for message,idx in this.props.messages.player
                        p(key="player-message-"+idx,className=message.className)=message.msg                 
        `
    }
}
