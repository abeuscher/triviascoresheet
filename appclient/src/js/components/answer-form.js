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
        .game-form
            h2=game.game_title
            h3=game.team_name
            form.answer-sheet(onSubmit=this.props.submitAnswer)
                if game.current_question==0
                    h4="Game Start Time: " + this.convertDate(game.start_time)
                    p=this.props.instructions[this.props.instructionMap[game.current_question]]
                else
                    h4="Current Question: " + game.current_question
                    p=this.props.instructions[this.props.instructionMap[game.current_question]]
                    if game.current_question==5 || game.current_question==15
                        label answers
                        input(type="text",onChange=e=>{this.props.changeAnswer(e,0)},value=this.props.answer_sheet.answers[0].content)
                        input(type="text",onChange=e=>{this.props.changeAnswer(e,1)},value=this.props.answer_sheet.answers[1].content)
                        input(type="text",onChange=e=>{this.props.changeAnswer(e,2)},value=this.props.answer_sheet.answers[2].content)
                        input(type="text",onChange=e=>{this.props.changeAnswer(e,3)},value=this.props.answer_sheet.answers[3].content)
                    else
                        label answer
                            input(type="text",name="current_answer",onChange=e=>{this.props.changeAnswer(e,0)},value=this.props.answer_sheet.answers[0].content)
                        label bid
                            select(onChange=this.props.changeBid)
                                for bid,idx in this.props.bids
                                    option(key="bid-option-"+idx,value=bid)=bid
                    button(onClick=this.props.submitAnswer) Submit Answer
        `
    }
}
