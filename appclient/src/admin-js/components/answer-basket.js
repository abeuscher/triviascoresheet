import React, { Component } from 'react'

export default class AnswerBasket extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            if !this.props.answers
                .answer-basket.padded-column.flex
                    .answer-row.flex.header
                        h2 Empty Basket
            else
                .answer-basket.padded-column.flex
                    .answer-row.flex.header
                        .column.question
                            p Question #                    
                        .column.team
                            p Team Name
                        .column.answer
                            p Answer
                        .column.controls
                            p Actions
                    for answer_sheet,idx in this.props.answers
                        .answer-row.flex(key='answer-basket-row-'+idx)
                            .column.question(key='answer-basket-question-'+idx)
                                p(key='answer-basket-question-label'+idx)="Q #"+answer_sheet.q
                            .column.team(key='answer-basket-team-'+idx)
                                p(key='answer-basket-team-label-'+idx)=answer_sheet.team.team_name
                            .column.answer(key='answer-basket-answer-'+idx)
                                for answer,answer_idx in answer_sheet.answers
                                    span.answer(key='answer-basket-team-label-'+idx+"-"+answer_idx)="answer: "+answer.content
                                    span.bid(key='answer-basket-team-bid-'+idx+"-"+answer_idx)="bid: "+answer.bid
                                    label(key='answer-basket-team-label-check-label-'+idx+"-"+answer_idx) correct?
                                        input(key='answer-basket-team-label-check-'+idx+"-"+answer_idx,type="checkbox",checked=answer.correct,onChange=e=>{this.props.tickAnswer(e,answer_idx, idx)})
                            .column.controls(key='answer-basket-control-'+idx)
                                a.btn.score-answer(key='answer-basket-button-'+idx,href="#",onClick=e=>{e.preventDefault();this.props.scoreAnswer(idx)}) Move to scoresheet                         
        `
    }
}