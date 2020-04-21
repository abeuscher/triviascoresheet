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
                    for ticket,idx in this.props.answers
                        .answer-sheet(key='answer-basket-row-'+idx)
                            p.question(key='answer-basket-question-label'+idx)="Question #"+ticket.answer_sheet.q
                            p.team(key='answer-basket-team-label-'+idx)="TEAM: " + ticket.team.team_name
                            .answer-box.flex(key='answer-basket-answer-'+idx)
                                .column.three-quarter.answer-header(key="answer-basket-answer-column-"+idx)
                                    .label(key="answer-basket-answer-label-"+idx) answer
                                .column.quarter.answer-header(key="answer-basket-control-column-"+idx)
                                    .label(key="answer-basket-control-label-"+idx) correct?                                
                                for a,answer_idx in ticket.answer_sheet.answers
                                    .column.three-quarter.answer-row(key="answer-basket-answer-column-"+idx+"-"+answer_idx)
                                        p.answer(key='answer-basket-answer-value-'+idx+"-"+answer_idx)=a.content
                                    .column.quarter.answer-row(key="answer-basket-control-column-"+idx+"-"+answer_idx)
                                        input(key='answer-basket-team-label-check-'+idx+"-"+answer_idx,type="checkbox",checked=a.correct,onChange=e=>{this.props.tickAnswer(e,idx,answer_idx)})
                                    if [5,15].indexOf(ticket.answer_sheet.q)==-1
                                        .column.bid(key='answer-basket-team-bid-'+idx+"-"+answer_idx)
                                            p(key='answer-basket-team-bid-label-'+idx+"-"+answer_idx)="BID: " + a.bid
                                        
                            a.button.score-answer(key='answer-basket-button-'+idx,href="#",onClick=e=>{e.preventDefault();this.props.scoreAnswer(idx)}) Move to scoresheet                         
        `
    }
}