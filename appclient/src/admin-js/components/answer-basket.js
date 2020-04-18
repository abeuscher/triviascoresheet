import React, { Component } from 'react'

export default class AnswerBasket extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
                .answer-basket.flex
                    .answer-row.flex.header
                        .column.question
                            p Question #                    
                        .column.team
                            p Team Name
                        .column.bid
                            p Bid
                        .column.answer
                            p Answer
                        .column.controls
                            p Actions
                    for answer,idx in this.props.answers
                        .answer-row.flex(key='answer-basket-row-'+idx)
                            .column.question
                                p="Q #"+answer.q
                            .column.team
                                p=answer.team_name
                            .column.bid
                                p=answer.bid
                            .column.answer
                                p=answer.answer
                            .column.controls
                                a.mark-right(href="#",onClick=e=>{e.preventDefault();this.props.gradeAnswer(answer,true)}) correct                           
                                a.mark-right(href="#",onClick=e=>{e.preventDefault();this.props.gradeAnswer(answer,false)}) incorrect                           
        `
    }
}