import React, { Component } from 'react'
// test change
export default class AdminNav extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return pug`
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
                    .game-buttons
                        if this.props.game.current_question>0
                            a.button.previous-question(key="scoresheet-btn-prev-question",href="#",onClick=this.props.changeQuestion) Previous Question
                        if this.props.game.current_question==0
                            a.button.next-question(key="scoresheet-btn-start",href="#",onClick=this.props.beginGame) Begin Game
                        else if this.props.game.current_question<this.props.game.num_questions
                            a.button.next-question(key="scoresheet-btn-next-question",href="#",onClick=this.props.changeQuestion) Next Question                     

    `
    }
}