import React, { Component } from 'react'

export default class ClientChat extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let unread = this.props.io.gamechat.messages.filter(msg=>{return msg.status=="unread"}).length
        return pug`
            .chat-widget
                if this.props.io
                    .column.messages.wide
                        .inner.scrollable
                            .scroll
                                for msg_place,message_idx in this.props.io.gamestatus.messages
                                    - let message = this.props.io.gamestatus.messages[this.props.io.gamestatus.messages.length-message_idx-1]
                                    p(key="gamestatus-message-"+message_idx)
                                        if message.username
                                            span.username=message.username + ": "
                                        span.message=message.msg                    
                    .column.messages.wide
                        .inner.scrollable
                            .scroll
                                for msg_place,message_idx in this.props.io.gamechat.messages
                                    - let message = this.props.io.gamechat.messages[this.props.io.gamechat.messages.length-message_idx-1]
                                    p(key="gamestatus-message-"+message_idx)
                                        if message.username
                                            span.username=message.username + ": "
                                        span.message=message.msg   
                                                 
                    .column.chat
                        .inner
                            form(onSubmit=this.props.sendChat,data-key="gamechat")
                                textarea(value=this.props.io.current_message,onChange=this.props.changeChat,data-key="gamechat")
                                .buttons
                                    button(onClick=this.props.sendChat,data-key="gamechat") Send Message  
        `
    }
}
class ChatRow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let key = this.props.index
        let unread = this.props.io.messages.filter(msg=>{return msg.status=="unread"}).length
        return pug`
        .box.team
            input(type="checkbox",name=key+"-toggle",id=key+"-toggle",onChange=this.props.markMessagesAsRead,data-key=this.props.index)
            .active-area
                label(for=key+"-toggle")=this.props.io.label + (unread > 0 ? " (" + unread + " unread)" : "")
                .column.messages(className=typeof this.props.io.current_message=="undefined" ? "wide" : "")
                    .inner.scrollable
                        .scroll
                            for msg_place,message_idx in this.props.io.messages
                                - let message = this.props.io.messages[this.props.io.messages.length-message_idx-1]
                                p(key=key+"-message-"+message_idx)
                                    if message.username
                                        span.username=message.username + ": "
                                    span.message=message.msg
                if typeof this.props.io.current_message!="undefined"
                    .column.chat
                        .inner
                            textarea(value=this.props.io.current_message,onChange=this.props.changeChat,data-key=this.props.index)
                            .buttons
                                button(onClick=this.props.sendChat,data-key=this.props.index) Send Message
                                button clr 
        `
    }  
}
