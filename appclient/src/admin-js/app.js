import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import WysiwygInput from './components/form-fields/wysiwyg-input'
import DateInput from './components/form-fields/date-input'

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
            mode: "create", // "create","run-game","manage-game"
            game_details: {
                title:"BLANK",
                start_time: new Date(),
                game_codes: [],
                game_details: "BLANK",
                num_questions: 20
            }
        };
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onCodesChange = this.onCodesChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    
    onTimeChange = e => {
        console.log(e);
    }

    onFieldChange = e => {
        this.state.game_details[e.target.name] = e.target.value
        this.setState(this.state);
    }

    onCodesChange = e => {
        this.state.game_details.game_codes = e.target.value.split(",")
        this.setState(this.state);
    }
    onSelectChange = e => {
        console.log(e);
    }
    createGame = e => {
        e.preventDefault()
        console.log("Create Game",e,this.state)
    }
    render() {

        return pug`
            h3 Create New Game:
            form(method="post")
                label(for="title") Title for Game
                    input(type="text",name="title",value=this.state.game_details.title,onChange=this.onFieldChange)
                label(for="game_codes") Game Code(s) 
                    .instructions Enter codes separated by commas. Codes must be at least 4 letters long and not longer than 16 letters or numbers. Game codes are NOT case sensitive. IE TSPUBMAY14
                    input(type="text",name="game_codes",value=this.state.game_details.game_codes.join(","),onChange=this.onCodesChange)
                label(for="num_questions") Number of Questions
                    select(name="num_questions", onChange=this.onSelectChange)
                        option(value="10") 10
                        option(value="10") 20
                DateInput(id="start_time",label="Start Time",onChange=this.onTimeChange,value=this.state.game_details.start_time)
                
                WysiwygInput(id="game_details",handleChange=this.onFieldChange,value=this.state.game_details.game_details)
                button(onClick=this.createGame) Create Game
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));