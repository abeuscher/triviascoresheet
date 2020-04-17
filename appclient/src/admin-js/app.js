import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import WysiwygInput from './components/form-fields/wysiwyg-input'
import DateInput from './components/form-fields/date-input'

import ApiConnector from './components/api-connector'

import GameForm from './components/game-form'
import GameManager from './components/game-manager'

/*

    App flow:
     - User enters team name
     - Game present twenty answers in a row.
     - App should check for current question number and not allow new submissions until it's time.
     - It would be nice to have a server triggered client side timer
     - Also should feature: Game Zoom Link, have space for other materials like PDFS or whatever.

    Next Steps:
     - Add Menu
     - Add Manager Mode
     - Add code generator / editor
     - Add game page

*/

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: "manager", // "create","run-game","manage-game"
            games: [],
            game_details: this.blankRecord
        };
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onWysiwygChange = this.onWysiwygChange.bind(this);
    }
    blankRecord = {
        game_title: "",
        start_time: new Date(),
        game_description: "",
        num_questions: 20
    }
    componentDidMount() {
        this.launchManager();
    }
    startEditMode(recordid) {
        ApiConnector("read", { id: recordid }, "game")
            .then(res.json())
            .then(console.log(res))
    }
    onTimeChange = e => {
        console.log(e);
        this.state.game_details.start_time = e
        this.setState(this.state)
    }
    launchManager = () => {
        this.state.mode = "manager"
        this.fetchGames()
        this.setState(this.state)
    }
    newGame = () => {
        this.state.mode = "create"
        this.state.game_details = this.blankRecord
        this.state.game_details.game_code = this.generateCode()
        this.setState(this.state)
    }
    onFieldChange = e => {
        this.state.game_details[e.target.name] = e.target.value
        this.setState(this.state)
    }

    onWysiwygChange = output => {
        this.state.game_details.game_description = output
        this.setState(this.state)
    }

    onSelectChange = e => {
        this.state.game_details.num_questions = e.target.options[e.target.selectedIndex].value
        this.setState(this.state)
    }
    editGame = record => {
        this.state.mode = "edit"
        this.state.game_details = record
        this.setState(this.state)
    }
    deleteGame = record => {
        console.log(record)
    }
    createGame = e => {
        e.preventDefault()
        let formData = JSON.stringify(this.state.game_details);
        ApiConnector("create", formData, "game")
            .then(res => {
                this.state.game_details = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    fetchGames = () => {
        ApiConnector("read", "", "game")
            .then(res => {
                this.state.games = res
                this.setState(this.state)
            })
    }
    updateGame = e => {
        e.preventDefault();
        let formData = JSON.stringify(this.state.game_details)
        ApiConnector("update", formData, "game")
            .then(res => {
                this.state.game_details = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    generateCode = () => {
        
        let hash = a => {
            a = (a + 0x7ed55d16) + (a << 12)
            a = (a ^ 0xc761c23c) ^ (a >> 19)
            a = (a + 0x165667b1) + (a << 5)
            a = (a + 0xd3a2646c) ^ (a << 9)
            a = (a + 0xfd7046c5) + (a << 3)
            a = (a ^ 0xb55a4f09) ^ (a >> 16)
            if (a < 0) a = 0xffffffff + a
            return a;
        }
        var seed = new Date().getTime() / 1000
        console.log("New Token:",hash(seed))
        return hash(seed)
    }
    render() {

        return pug`
            nav    
                a(href="#",onClick=this.launchManager) Manage Games
                a(href="#",onClick=this.newGame) Create New Game
            if this.state.mode=="manager"
                GameManager(
                    games=this.state.games,
                    editGame=this.editGame,
                    deleteGame=this.deleteGame
                    )
            else
                if this.state.mode=="edit"
                    h3 Player Link:
                    a(href="http://teamtrivia.local/?pqid="+this.state.game_details.game_code)="http://teamtrivia.local/?pqid="+this.state.game_details.game_code
                GameForm(
                    game_details=this.state.game_details,
                    onWysiwygChange=this.onWysiwygChange,
                    onFieldChange=this.onFieldChange,
                    onTimeChange=this.onTimeChange,
                    onSelectChange=this.onSelectChange,
                    onCodesChange=this.onCodesChange,
                    mode=this.state.mode
                    createGame=this.createGame,
                    updateGame=this.updateGame
                    )
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));