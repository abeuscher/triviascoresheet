import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import IntroForm from './components/intro-form'

import apiConnector from './components/api-connector'

/*

    App flow:
     - User enters team name
     - Game present twenty answers in a row.
     - App should check for current question number and not allow new submissions until it's time.
     - It would be nice to have a server triggered client side timer
     - Also should feature: Game Zoom Link, have space for other materials like PDFS or whatever.
*/

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teamName: "BLANK",
            gameid:null,
            currentQuestion: 0,
            gameDetails:{}
        };
        this.handleIntroFormChange = this.handleIntroFormChange.bind(this);
    }
    handleIntroFormChange(e) {
        let newValue = e.target.value
        let name = e.target.name
        this.state[name] = newValue
        this.setState(this.state);
    }
    handleIntroFormSubmit(e) {
        console.log(e);
    }
    render() {

        return pug`
            IntroForm(teamName=this.state.teamName,gameID=this.state.gameID,onChange=this.handleIntroFormChange,onSubmit=this.handleIntroFormSubmit)
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));