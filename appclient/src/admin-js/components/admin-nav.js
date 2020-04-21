import React, { Component } from 'react'

export default class AdminNav extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return pug`
        nav    
            .admin-controls
                for button,idx in this.props.adminButtons
                    a.button(key="admin-nav-"+idx,href="#", onClick=button.action)=button.label
            if this.props.mode=="play"
                .game-controls
                    .info-block
                        .item.game-title
                            span.label Current Game
                            span.value=this.props.game.game_title
                        .item.game-status
                            span.label Status
                            span.value=this.props.game.game_status
                        .item.current-question
                            span.label Current Question
                            span.value=this.props.game.current_question
                        .item.total-teams
                            span.label Total Teams
                            span.value=this.props.game.scoresheet.length
                        .item.player-link
                            span.label Game link
                            span.value
                                a(href="http://teamtrivia.local/?pqid="+this.props.game.game_code,target="_blank")="http://teamtrivia.local/?pqid="+this.props.game.game_code
                    .game-buttons
                        h2 Game Controls
                        if this.props.game.current_question>0
                            a.button.previous-question(key="scoresheet-btn-prev-question",href="#",onClick=()=>{this.props.changeQuestion(this.props.game.current_question-1)}) Previous Question
                        if this.props.game.current_question<20
                            a.button.next-question(key="scoresheet-btn-next-question",href="#",onClick=()=>{this.props.changeQuestion(this.props.game.current_question+1)}) Next Question
    `
    }
}