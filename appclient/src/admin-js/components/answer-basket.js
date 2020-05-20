import React, { Component } from 'react'

export default class AnswerBasket extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            if !this.props.answers
                .answer-basket.padded-column.section-title
                    h2="Answer Basket (empty)"
            else if !this.props.answers.length
                .answer-basket.padded-column.section-title
                    h2="Answer Basket (empty)"
            else
                .answer-basket.padded-column.section-title
                    h2="Answer Basket ("+this.props.answers.length+" pending)"
                .answer-basket.answer-carousel
                    for ticket, idx in this.props.answers
                        .answer-sheet(key='answer-basket-row-'+idx)
                            p.question(key='answer-basket-question-label'+idx)="Question #"+ticket.answer_sheet.q
                            if ticket.team
                                p.team(key='answer-basket-team-label-'+idx)=ticket.team.team_name
                            else
                                p This is a broken ticket with no team. WTF?
                            .answer-box.flex(key='answer-basket-answer-'+idx)
                                .column.three-quarter.answer-header(key="answer-basket-answer-column-"+idx)
                                    p.label(key="answer-basket-answer-label-"+idx) answer
                                .column.quarter.answer-header(key="answer-basket-control-column-"+idx)
                                    p.label(key="answer-basket-control-label-"+idx) correct?                                
                                for a,answer_idx in ticket.answer_sheet.answers
                                    .column.three-quarter.answer-row(key="answer-basket-answer-column-"+idx+"-"+answer_idx)
                                        p.answer(key='answer-basket-answer-value-'+idx+"-"+answer_idx)=a.content
                                    .column.quarter.answer-row(key="answer-basket-control-column-"+idx+"-"+answer_idx)
                                        input(
                                            key='answer-basket-team-label-check-'+idx+"-"+answer_idx,
                                            type="checkbox",
                                            checked=a.correct,
                                            onChange=e=>{this.props.tickAnswer(e,idx,answer_idx)}
                                            )
                                    if [5,15].indexOf(ticket.answer_sheet.q)==-1
                                        .column.bid(key='answer-basket-team-bid-'+idx+"-"+answer_idx)
                                            p.bid(key="answer-basket-teaam-bid-label") Bid:
                                                span(key="answer-basket-team-bid-display-"+idx+"-"+answer_idx)=a.bid
                                            label(
                                                key="answer-basket-teaam-score-label",
                                                for="answer-basket-team-score-field-"+idx+"-"+answer_idx
                                                ) Score (editing here will override normal scoring):
                                            input(
                                                id="answer-basket-team-score-field-"+idx+"-"+answer_idx,
                                                name="answer-basket-team-score-field-"+idx+"-"+answer_idx,
                                                key="answer-basket-team-score-field-"+idx+"-"+answer_idx,
                                                value=ticket.answer_sheet.score,
                                                data-basket-idx=idx,
                                                data-answer-idx=answer_idx,
                                                onChange=this.props.changeScore
                                                )
                                        
                            a.button.score-answer(key='answer-basket-button-'+idx,href="#",onClick=e=>{e.preventDefault();this.props.scoreAnswer(idx)}) Move to scoresheet  
                            a.button.delete-answer(key='answer-basket-delete-'+idx,href="#",onClick=e=>{e.preventDefault();this.props.deleteAnswer(ticket)}) Delete               
        `
    }
}