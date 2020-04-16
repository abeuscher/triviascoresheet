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
            if this.props.mode=="create"
                h3 Create New Game:
            else 
                h3="Edit Record id#"+this.props.game_details._id
            form(method="post")
                label(for="game_title") Title for Game
                    input(type="text",name="game_title",value=this.props.game_details.game_title,onChange=this.props.onFieldChange)
                label(for="num_questions") Number of Questions
                    select(name="num_questions", onChange=this.props.onSelectChange)
                        option(value="10") 10
                        option(value="20") 20
                DateInput(id="start_time",label="Start Time",onChange=this.props.onTimeChange,value=this.props.game_details.start_time)
                
                WysiwygInput(id="game_details",handleChange=this.props.onWysiwygChange,value=this.props.game_details.game_description)
                if this.props.mode=="create"
                    button(onClick=this.props.createGame) Create Game
                else
                    button(onClick=this.props.updateGame) Update Game
                    button(onClick=this.props.deleteGame) Delete Game
        `
    }
}