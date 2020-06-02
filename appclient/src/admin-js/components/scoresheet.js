import React, { Component } from 'react'

export default class Scoresheet extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        const scoreUpdateMap = [5, 10, 15, 20, this.props.game.num_questions - 1]
        const theCount = Array.apply(null, Array(this.props.game.num_questions)), total = 0
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
                ScoreSheetRow(
                    key="row-"+row_idx
                    rowIndex=row_idx,
                    row=row,
                    sendTeamToWaitingRoom=this.props.sendTeamToWaitingRoom,
                    theCount=theCount,
                    sendToBasket=this.props.sendToBasket,
                    scoreUpdateMap=scoreUpdateMap,
                    currentQuestion=this.props.game.current_question
                )         
        `
    }
}
class ScoreSheetRow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            - let total = 0;
            .score-row.flex
                .team-column(onClick=()=>{this.props.sendTeamToWaitingRoom(this.props.row.team)})
                    h2=this.props.row.team.team_name
                - let updateKey = 0
                for i,idx in this.props.theCount
                    - let c = idx + 1
                    - let checkForAnswer = this.props.row.scored_sheets.filter(a => { return a.q==c })
                    - let item = false
                    if checkForAnswer.length>0
                        - item = checkForAnswer[0]
                    - let cellVal = item ? item.status=="override" ? item.score : [5,10,15,20].indexOf(c)>-1 ? item.score : item.answers[0].bid : " "
                    AnswerBox(
                        key="answer-"+idx
                        onClick=item ? this.props.sendToBasket : null,
                        rowIndex=this.props.rowIndex,
                        questionNumber=item ? item.q : null,
                        labelClass=item ? item.status=="override" ? "override" : [5,15].indexOf(c)>-1 ? "true" : item.answers[0].correct ? "true" : "false" : "",
                        cellValue=cellVal,
                        extraClass=item ? "" : "blank"
                        )
                        - total = item ? total + item.score : total                          
                    if this.props.scoreUpdateMap.indexOf(c)>-1
                        - let cellVal = c<=this.props.currentQuestion ? total : "U"
                        - updateKey++
                        .answer-box.update(key="update-"+updateKey)
                            p(key="update-label-"+updateKey)=cellVal
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
                data-row-index=this.props.rowIndex,
                data-question-number=this.props.questionNumber
                )
                p(
                    className=this.props.labelClass || "",
                    )=this.props.cellValue.toString()
        `
    }
}