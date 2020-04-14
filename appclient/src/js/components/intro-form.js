import React, { Component } from 'react'

export default class IntroForm extends Component {
    constructor(props) {
        super(props); 
    }

    render() {
        return pug`
            form(method="post")
            p Please Enter Your Team Name:
            input(type="text",name="teamName",value=this.props.teamName,onChange=this.props.onChange)
            p Please enter game id as provided by your host:
            input(type="text",name="gameid",value=this.props.gameID,onChange=this.props.onChange)
            input(type="button",value="Submit",onClick=this.props.onSubmit)
        `
    }
}
