import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import WysiwygInput from './form-fields/wysiwyg-input'
import DateInput from './form-fields/date-input'


export default class GameForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .game-entry-form.padded-column.section-title
                if this.props.mode=="create"
                    h2 Create New Game:
                else 
                    h2="Editing Game: "+this.props.game.game_title   
            .game-entry-form.padded-column.flex
                .column         
                    label(for="game_title") Title for Game
                    input(type="text",name="game_title",value=this.props.game.game_title,onChange=this.props.onFieldChange)
                .column.half
                    label(for="num_questions") Number of Questions
                    select(name="num_questions", onChange=this.props.onSelectChange,value=this.props.game.num_questions)
                        option(value="10") 10
                        option(value="20") 20
                .column.half
                    DateInput(id="start_time",label="Start Time",onChange=this.props.onTimeChange,selected=new Date(this.props.game.start_time))
                .column
                    WysiwygInput(id="game",handleChange=this.props.onWysiwygChange,value=this.props.game.game_description)
                .column
                    if this.props.mode=="create"
                        button(onClick=this.props.createGame) Create Game
                    else
                        button(onClick=this.props.saveGame) Save Changes
                        button(onClick=this.props.deleteGame) Delete Game
            .game-entry-form.padded-column.status
                p=this.props.status
        `
    }
}