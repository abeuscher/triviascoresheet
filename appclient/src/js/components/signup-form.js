import React, { Component } from 'react'

export default class SignupForm extends Component {
    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            .signup-form.padded-column
                if !this.props.game
                    h2 loading...
                else
                    h2=this.props.game.game_title
                    .description=this.props.game.game_description
                    p Please Enter Your Team Name:
                    input(type="text",name="team_name",value=this.props.team.team_name,onChange=this.props.onChange)
                    a.button(onClick=this.props.onSubmit) Join Game
        `
    }
}
