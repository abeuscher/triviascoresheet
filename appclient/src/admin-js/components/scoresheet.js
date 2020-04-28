import React, { Component } from 'react'

export default class Scoresheet extends Component {

    constructor(props) {
        super(props);
    }
    scoreUpdateMap = [5,10,15,19,20]
    checkForUpdate = q => {
        return this.scoreUpdateMap.indexOf(q)>-1
    }
    getScore = (question,answers) => {
        let output = false;
        answers.forEach(answer => {
            if (answer.q==question) {
                output = answer;
            }
        })
        return output;
    }
    render() {
        return pug`
        - let theCount = Array.apply(null, Array(20)), total=0
        .scoresheet
            .padded-column.section-title
                h2 Scoresheet        
            .scoresheet-header.flex
                .team-column
                    h2 Team Name
                each i,idx in theCount
                    - let c = idx + 1
                    .answer-box(key="scoresheet-header-"+c,className=c==this.props.game.current_question?"current":"")
                        p(key="scoresheet-header-p-"+c)=c
                    if this.checkForUpdate(c)
                        .answer-box.update(key="scoresheet-header-update-"+c)
                            p(key="scoresheet-header-update-p-"+c) U
            for row,row_idx in this.props.game.scoresheet
                - let total = 0;
                .score-row.flex(key="scoresheet-form-row-"+row_idx)
                    .team-column(key="scoresheet-team-column-"+row_idx,onClick=()=>{this.props.sendTeamToWaitingRoom(row.team)})
                        h2(key="scoresheet-team-label-"+row_idx)=row.team.team_name
                    each i,idx in theCount
                        - let c = idx + 1
                        if this.getScore(c,row.scored_sheets)
                            - let item = this.getScore(c,row.scored_sheets)
                            - let cellVal = item.status=="override" ? item.score : [5,10,15,20].indexOf(c)>-1 ? item.score : item.answers[0].bid
                            AnswerBox(
                                key="answer-box-normal-"+row_idx+"-"+c,
                                sheet=JSON.stringify(item),
                                onClick=this.props.sendToBasket,
                                labelClass=item.status=="override" ? "override" : [5,15].indexOf(c)>-1 ? "true" : item.answers[0].correct ? "true" : "false",
                                cellValue=cellVal
                                )
                            - total = total + item.score           
                        else
                            AnswerBox(
                                key="answer-box-blank-"+row_idx+"-"+c,
                                cellValue=" ",
                                extraClass="blank"
                                )                
                        if this.checkForUpdate(c)
                            - let cellVal = c<=this.props.game.current_question ? total : "U"
                            AnswerBox(
                                key="answer-box-update-"+row_idx+"-"+c,
                                cellValue=cellVal,
                                extraClass="update"
                                )                
        `
    }
}
class AnswerBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .answer-box(
                className=this.props.extraClass || "",
                onClick=this.props.onClick || null,
                data-item=this.props.sheet || ""
                )
                p(
                    className=this.props.labelClass || "",
                    )=this.props.cellValue.toString()
        `
    }  
}