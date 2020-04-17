import React, { Component } from 'react'

export default class IntroForm extends Component {
    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            form(method="post")
            h2="Game Title : " + this.props.game_title
            p Please Enter Your Team Name:
            input(type="text",name="teamName",value=this.props.teamName,onChange=this.props.onChange)
            input(type="button",value="Submit",onClick=this.props.onSubmit)
        `
    }
}
