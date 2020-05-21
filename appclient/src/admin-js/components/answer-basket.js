import React, { Component } from "react"

export default class AnswerBasket extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return pug`
                .answer-basket.padded-column.section-title
                    h2="Answer Basket ("+this.props.total+" pending)"
                .answer-basket.answer-carousel
                    if this.props.current_sheet.team
                        .answer-sheet(key="answer-basket-row")
                            p.question(key="answer-basket-question-label")="Question #"+this.props.current_sheet.answer_sheet.q
                            if this.props.current_sheet.team
                                p.team(key="answer-basket-team-label-")=this.props.current_sheet.team.team_name
                            else
                                p This is a broken ticket with no team. WTF?
                            .answer-box.flex(key="answer-basket-answer")
                                .column.three-quarter.answer-header(key="answer-basket-answer-column")
                                    p.label(key="answer-basket-answer-label") answer
                                .column.quarter.answer-header(key="answer-basket-control-column")
                                    p.label(key="answer-basket-control-label") correct?                                
                                for a,answer_idx in this.props.current_sheet.answer_sheet.answers
                                    .column.three-quarter.answer-row(key="answer-basket-answer-column-"+answer_idx)
                                        p.answer(key="answer-basket-answer-value-"+answer_idx)=a.content
                                    .column.quarter.answer-row(key="answer-basket-control-column-"+answer_idx)
                                        input(
                                            key="answer-basket-team-label-check-"+answer_idx,
                                            type="checkbox",
                                            checked=a.correct,
                                            onChange=e=>{this.props.tickAnswer(e,answer_idx)}
                                            )
                                    if [5,15].indexOf(this.props.current_sheet.answer_sheet.q)==-1
                                        .column.bid(key="answer-basket-team-bid-"+answer_idx)
                                            p.bid(key="answer-basket-teaam-bid-label") Bid:
                                                span(key="answer-basket-team-bid-display-"+answer_idx)=a.bid
                                            label(
                                                key="answer-basket-teaam-score-label",
                                                for="answer-basket-team-score-field-"+answer_idx
                                                ) Score (editing here will override normal scoring):
                                            input(
                                                id="answer-basket-team-score-field-"+answer_idx,
                                                name="answer-basket-team-score-field-"+answer_idx,
                                                key="answer-basket-team-score-field-"+answer_idx,
                                                value=this.props.current_sheet.answer_sheet.score,
                                                data-answer-idx=answer_idx,
                                                onChange=this.props.changeScore
                                                )
                                            
                                a.button.score-answer(key="answer-basket-button",href="#",onClick=e=>{e.preventDefault();this.props.scoreAnswer()}) Move to scoresheet  
                                a.button.delete-answer(key="answer-basket-delete",href="#",onClick=e=>{e.preventDefault();this.props.deleteAnswer()}) Delete               
        `
    }
}