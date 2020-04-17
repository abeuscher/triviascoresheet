import React, { Component } from 'react'

export default class IntroForm extends Component {
    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            form(method="post")
            h2=this.props.game.game_title
            p Please Enter Your Team Name:
            input(type="text",name="team_name",value=this.props.game.team_name,onChange=this.props.onChange)
            input(type="button",value="Submit",onClick=this.props.onSubmit)
        `
    }
}
