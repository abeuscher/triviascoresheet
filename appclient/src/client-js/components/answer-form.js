import React, { Component } from 'react'

export default class AnswerForm extends Component {
    constructor(props) {
        super(props); 
    }
    convertDate = i => {
        const d = new Date(i)
        const dtf = new Intl.DateTimeFormat('en', { weekday:'long',year: 'numeric', month: 'long', day: 'numeric', hour:'numeric',minute:'2-digit',second:'2-digit' }) 
        const [{ value: we },,{ value: mo },,{ value: da },,{ value: ye },,{ value: ho },,{ value: mi },,{ value: se }] = dtf.formatToParts(d) 
        return `${we} ${mo} ${da}, ${ye} ${ho}:${mi}:${se}`;
    }
    render() {
        return pug`
        - let game = this.props.game
        .answer-form.section-title
            h2=game.game_title
        .answer-form
            h3="Your Team: "+this.props.team.team_name
            if this.props.mode=="waiting_room"
                h4 You are in the waiting room. Please wait for the host to add you to the game.
            else if game.current_question==0
                h4="Game Start Time: " + this.convertDate(game.start_time)
                p=this.props.instructions[this.props.instructionMap[game.current_question]]
            else
                h2="Current Question: " + game.current_question
                if !this.props.answer_sheet
                    p Current Question has been answered. Hang tight for the next question.
                else
                    p=this.props.instructions[this.props.instructionMap[game.current_question]]
                if this.props.answer_sheet && this.props.bids
                    if game.current_question==5 || game.current_question==15
                        for answer,answer_idx in this.props.answer_sheet.answers
                            label(key="label-" + answer_idx)="answer " + (answer_idx+1)
                                input(key="answer-" + answer_idx,type="text",onChange=e=>{this.props.changeAnswer(e,answer_idx)},value=this.props.answer_sheet.answers[answer_idx].content)
                    else
                        label answer
                            input(type="text",name="current_answer",onChange=e=>{this.props.changeAnswer(e,0)},value=this.props.answer_sheet.answers[0].content)
                        label bid
                            select(onChange=this.props.changeBid,value=this.props.currentBid)
                                option(value=this.props.currentBid)=this.props.currentBid
                                for bid,idx in this.props.bids
                                    option(key="bid-option-"+idx,value=bid)=bid
                    a.button(onClick=this.props.submitAnswer) Submit Answer
        `
    }
}
