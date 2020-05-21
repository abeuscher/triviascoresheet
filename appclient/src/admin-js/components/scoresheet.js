import React, { Component } from 'react'

export default class Scoresheet extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        const scoreUpdateMap = [5,10,15,20,this.props.game.num_questions-1]
        const theCount = Array.apply(null, Array(this.props.game.num_questions)), total=0
        return pug`
        .scoresheet    
            .scoresheet-header.flex
                .team-column
                    h2 Team Name
                each i,idx in theCount
                    - let c = idx + 1
                    .answer-box(key="scoresheet-header-"+c,className=c==this.props.game.current_question?"current":"")
                        p(key="scoresheet-header-p-"+c)=c
                    if scoreUpdateMap.indexOf(c)>-1
                        .answer-box.update(key="scoresheet-header-update-"+c)
                            p(key="scoresheet-header-update-p-"+c) U
            for row,row_idx in this.props.game.scoresheet
                - let total = 0;
                .score-row.flex(key="scoresheet-form-row-"+row_idx)
                    .team-column(key="scoresheet-team-column-"+row_idx,onClick=()=>{this.props.sendTeamToWaitingRoom(row.team)})
                        h2(key="scoresheet-team-label-"+row_idx)=row.team.team_name
                    each i,idx in theCount
                        - let c = idx + 1
                        - let checkForAnswer = row.scored_sheets.filter(a => { return a.q==c })
                        - let item = false
                        if checkForAnswer.length>0
                            - item = checkForAnswer[0]
                        - let cellVal = item ? item.status=="override" ? item.score : [5,10,15,20].indexOf(c)>-1 ? item.score : item.answers[0].bid : " "
                        AnswerBox(
                            key="answer-"+row_idx+"-"+c,
                            sheet=item ? JSON.stringify(item) : null,
                            onClick=item ? this.props.sendToBasket : null,
                            labelClass=item ? item.status=="override" ? "override" : [5,15].indexOf(c)>-1 ? "true" : item.answers[0].correct ? "true" : "false" : "",
                            cellValue=cellVal,
                            extraClass=item ? "" : "blank"
                            )
                            - total = item ? total + item.score : total                          
                        if scoreUpdateMap.indexOf(c)>-1
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