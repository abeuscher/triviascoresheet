import React, { Component } from 'react'

export default class ClientChat extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .client-chat-widget
                if this.props.io
                    h3 status
                    .game-status
                        .inner.scrollable
                            .scroll
                                for msg_place,message_idx in this.props.io.gamestatus.messages
                                    - let message = this.props.io.gamestatus.messages[this.props.io.gamestatus.messages.length-message_idx-1]
                                    p(key="gamestatus-message-"+message_idx)
                                        if message.username
                                            span.username=message.username + ": "
                                        span.message=message.msg                    
                    h3 chat
                    .game-chat-stream
                        .inner.scrollable
                            .scroll
                                for msg_place,message_idx in this.props.io.gamechat.messages
                                    - let message = this.props.io.gamechat.messages[this.props.io.gamechat.messages.length-message_idx-1]
                                    p(key="gamestatus-message-"+message_idx)
                                        if message.username
                                            span.username=message.username + ": "
                                        span.message=message.msg   
                                                 
                    .game-chat-box
                        .inner
                            form(onSubmit=this.props.sendChat,data-key="gamechat")
                                textarea(name="gamechat",value=this.props.io.gamechat.current_message,onChange=this.props.changeChat,data-key="gamechat",onKeyDown=this.props.chatkeyDown)
                                .buttons
                                    button.button(onClick=this.props.sendChat,data-key="gamechat") Send Message  
        `
    }
}