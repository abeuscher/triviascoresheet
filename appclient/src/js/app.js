import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import IntroForm from './components/intro-form'
import GameForm from './components/game-form'

import ApiConnector from './components/api-connector'

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
        let saveState = this.getLocalStorage();
        this.state = saveState ? saveState : this.defaultState;
    }

    componentDidMount() {
        if (this.state.mode=="fresh") {
            this.initGameFromHash()
        }
    }

    componentDidUpdate() {
        this.setLocalStorage()
    }    

    defaultState = {
        mode: "fresh", //fresh, active, over
        error: "",
        game: {
            team_name: "BLANK",
            _id: null,
            game_title: "",
            game_details:"",
            start_time:null,
            round:0,
            question:0,
            score:{
                history:[],
                current_score:0
            },
            bids:[1,3,5,7],
            current_answer:"",
            current_bid:null
        }  
    }
    instructionStrings = [
        "Game has not yet started. Hold tight.",
        "You may bid 1,3,5, or 7. You may bid each point value ONCE per round.",
        "Each correct answer is worth 2 points",
        "Bid from 2 - 10 in even numbers. If you are wrong, HALF of your bid will be deducted from your score.",
        "You may bid 2,4,6, or 8. You may bid each point value ONCE per round.",
        "Each correct answer is worth 5 points",
        "Bid from 2 - 20 in even numbers. If you are wrong, HALF of your bid will be deducted from your score.",
    ]
    instructionMap = [0,1,1,1,1,2,1,1,1,1,3,4,4,4,4,5,4,4,4,4,6]
    setLocalStorage = () => {
        if (this.state.game._id!=null) {
            console.log("Set game state")
            window.sessionStorage.setItem("gamestate", JSON.stringify(this.state));
        }
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("gamestate") != undefined) {
            return JSON.parse(window.sessionStorage.getItem("gamestate"))
        }
        return false
    }

    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("gamestate");
        var f = window.sessionStorage.getItem("gamestate");
    }

    initGameFromHash = () => {
        let url_hash = this.getUrlParameter("pqid")
        if (!url_hash) {
            this.state.error = "No game specified. Bad URL"
            this.setState(this.state)
        }
        else {
            ApiConnector("read", JSON.stringify({ game_code: url_hash }), "game")
                .then(res => {
                    if (res.length == 1) {
                        const difference = +new Date(res[0].start_time) - +new Date()
                        if (difference < 0) {
                            this.state.error = "This game has already started."
                        }
                        else {
                            this.state.game = Object.assign({},this.state.game,res[0])
                        }

                        this.setState(this.state)
                    }
                    else {
                        this.state.error = "No game specified. Bad URL";
                        this.setState(this.state)

                    }
                })

        }
    }

    getUrlParameter = name => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
        const results = regex.exec(location.search)
        let decoded = null
        try {
            decoded = decodeURIComponent(results[1].replace(/\+/g, ' '))
        }
        catch (e) {
            decoded = null
        }
        return results === null ? '' : decoded
    }

    handleFormChange = e => {
        let newValue = e.target.value
        let name = e.target.name
        this.state.game[name] = newValue
        this.setState(this.state);
    }

    handleIntroFormSubmit = e => {
        console.log("Add Team",this.state);
        ApiConnector("addTeam", JSON.stringify({ id: this.state.game._id, team_name: this.state.game.team_name }))
            .then(res => {
                console.log(res)
                if (res.game) {
                    var now = new Date()
                    if (res.game.start_time < now) {
                        this.state.error = "The game has passed. It is too late. Give up now."
                    }
                    else {
                        console.log(this.state,"Loaded game info:",res.game)
                        this.state.mode="active"
                        this.setState(this.state)
                    }
                }

            })
    }
    
    handleAnswerSubmit = e => {
        e.preventDefault()
        console.log("Answer submitted");
    }

    render() {

        return pug`
            if this.state.error!=""
                h2.error=this.state.error
            else
                if this.state.mode=="fresh"
                    IntroForm(
                        teamName=this.state.teamName,
                        game=this.state.game,
                        onChange=this.handleFormChange,
                        onSubmit=this.handleIntroFormSubmit
                        )
                if this.state.mode=="active"
                    GameForm(
                        game=this.state.game,
                        onChange=this.handleFormChange,
                        submitAnswer=this.handleAnswerSubmit,
                        instructions=this.instructionStrings,
                        instructionMap=this.instructionMap
                    )
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));