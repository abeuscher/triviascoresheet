import React, { Component } from 'react'

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .chat-widget
                if this.props.messages
                    for i,idx in Object.keys(this.props.messages)
                        ChatRow(
                            index=i,
                            key="chatbox-"+idx,
                            io=this.props.messages[i],
                            markMessagesAsRead=this.props.markMessagesAsRead,
                            changeChat=this.props.changeChat,
                            sendChat=this.props.sendChat,
                            chatkeyDown=this.props.chatkeyDown
                            )
                              
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
                            textarea(value=this.props.io.current_message,onChange=this.props.changeChat,onKeyDown=this.props.chatkeyDown,data-key=this.props.index)
                            .buttons
                                button(onClick=this.props.sendChat,data-key=this.props.index) Send Message
        `
    }  
}
