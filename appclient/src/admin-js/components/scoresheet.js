import React, { Component } from 'react'

export default class Scoresheet extends Component {

    constructor(props) {
        super(props);
    }
    scoreUpdateMap = [5,10,15,19]
    checkForUpdate = q => {
        return this.scoreUpdateMap.indexOf(q-1)>-1
    }
    getScore = (question,answers) => {
        let output = false;
        answers.forEach(answer => {
            if (answer.q==question) {
                output = true;
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
                h4="Total Teams: "+ this.props.game.teams.length
            nav
                a.advance-question(href="#",onClick=this.props.nextQuestion) Next Question
                a.start-timer(href="#") Start One Minute Timer
            .answer-basket
                .scoresheet-header-row.flex
                    .team-column
                        p Team Name
                    while c<21
                        .answer-box(key="header-"+c)
                            p(key='header-p-'+c)=c++
                        if this.checkForUpdate(c)
                            .answer-box.update(key="header-update-"+c)
                                p(key='header-update-p-'+c) U
            for score,score_idx in this.props.game.teams
                .score-row.flex(key='form-row-'+score_idx)
                    .team-column(key='team-column-'+score_idx)
                        h2(key='team-label-'+score_idx)=score.team
                    - c = 1, total = 0;
                    while c<21
                        if this.getScore(c,score.answers)
                            .answer-box(key='answer-column-'+score_idx+"-"+c)
                                p(key='answer-label-'+score_idx+"-"+c,className=item.correct)=item.bid
                                - total = total + item.bid                     
                        else
                            .answer-box.blank(key='answer-column-'+score_idx+"-"+c)
                                p(key='answer-label-'+score_idx+"-"+c)=" "              
                        if this.checkForUpdate(c)
                            .answer-box.update(key='answer-update-'+score_idx+"-"+c)
                                p(key='answer-update-label-'+score_idx+"-"+c) U
                        - c++      
                
        `
    }
}