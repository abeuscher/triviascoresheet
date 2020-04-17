import React, { Component } from 'react'

export default class GameForm extends Component {
    constructor(props) {
        super(props); 
    }

    render() {
        
        return pug`
        - let game = this.props.game
        .game-form
            h2=game.game_title
            h3=game.teamname
            if game.current_question!=0
                h4="Current Question: " + game.current_question
            else
                h4="Game Start Time: " + game.start_time
            form.answer-sheet(onSubmit=this.props.submitAnswer)
                h2 Current Answer
                p=this.props.instructions[this.props.instructionMap[game.current_question]]
                label answer
                    input(type="text",name="answer_"+game.current_question)
                label bid
                    select
                        for bid in game.bids
                            option(value=bid)=bid
                button(onClick=this.props.submitAnswer) Submit Answer
        `
    }
}
