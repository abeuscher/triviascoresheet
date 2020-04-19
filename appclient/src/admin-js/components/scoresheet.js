import React, { Component } from 'react'

export default class Scoresheet extends Component {

    constructor(props) {
        super(props);
    }
    scoreUpdateMap = [5,10,15,19]
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
        - let c = 1, total=0
        .scoresheet
            header
                h2=this.props.game.game_title
                h3 Status: In progress
                h4="Current Question: "+this.props.game.current_question
                h5="Total Teams: "+ this.props.game.teams.length
            nav
                if this.props.game.current_question>1
                    a.previous-question(key="scoresheet-btn-prev-question",href="#",onClick=()=>{this.props.changeQuestion(this.props.game.current_question-1)}) Previous Question
                if this.props.game.current_question<20
                    a.next-question(key="scoresheet-btn-next-question",href="#",onClick=()=>{this.props.changeQuestion(this.props.game.current_question+1)}) Next Question
                a.start-timer(key="scoresheet-btn-start-timer",href="#") Start One Minute Timer
            .scoresheet-header(key="scoresheet-header")
                .scoresheet-header-row.flex(key="scoresheet-header-row")
                    .team-column(key="scoresheet-team-name-header")
                        p(key="scoresheet-team-name-header-label") Team Name
                    while c<21
                        .answer-box(key="scoresheet-header-"+c)
                            p(key="scoresheet-header-p-"+c)=c
                        if this.checkForUpdate(c)
                            .answer-box.update(key="scoresheet-header-update-"+c)
                                p(key="scoresheet-header-update-p-"+c) U
                        - c++
            for score,score_idx in this.props.game.teams
                - c = 1, total = 0;
                .score-row.flex(key="scoresheet-form-row-"+score_idx)
                    .team-column(key="scoresheet-team-column-"+score_idx)
                        h2(key="scoresheet-team-label-"+score_idx)=score.team 
                    while c<21
                        if this.getScore(c,score.answers)
                            - let item = this.getScore(c,score.answers)
                            .answer-box(key="answer-"+score_idx+"-"+c)
                                p(key="answer-label-"+score_idx+"-"+c,className=item.correct.toString())=item.bid
                                - total = total + item.bid                     
                        else
                            .answer-box.blank(key="blank-"+score_idx+"-"+c)
                                p(key="blank-label-"+score_idx+"-"+c)=" "                   
                        if this.checkForUpdate(c)
                            - let cellVal = c<=this.props.game.current_question ? total : "U"
                            .answer-box.update(key="update-"+score_idx+"-"+c)
                                p(key="update-label-"+score_idx+"-"+c)=cellVal 
                        - c++                     
        `
    }
}