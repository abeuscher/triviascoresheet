import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import IntroForm from './components/intro-form'
import AnswerForm from './components/answer-form'

import ApiConnector from './components/api-connector'

import io from 'socket.io-client'

/*

    App flow:
     - User enters team name
     - Host logs in

    Forget automatic timing / start time logic for now in favor of i/o layer controlling that piece. Message displays game is not started until host presses start.

    Answers submit to DB. DB pings host and puts them in answer basket.

    Once answer is submitted, answer sheet is locked until next question.

     - App should check for current question number and not allow new submissions until it's time.
     - It would be nice to have a server triggered client side timer
     - Also should feature: Game Zoom Link, have space for other materials like PDFS or whatever.
*/

class App extends Component {

    constructor(props) {
        super(props)
        let saveState = this.getLocalStorage()
        this.state = saveState ? saveState : this.defaultState
        this.makeSocketConnection()

        if (saveState) {
            this.state.current_answer_sheet = this.makeBlankAnswerSheet()
            this.refreshGame()
        }
        if (this.state.mode == "fresh") {
            this.initGameFromHash()
        }

    }

    socket = io('http://teamtrivia.localapi:5000')
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            console.log("Socket connected")
        });
        this.socket.on('disconnect', function () {
            console.log("Socket dropped")
        });
        this.socket.on('host message', msg => {
            console.log(msg)
        });
        this.socket.on("gamecontrol", msg => {
            this.handleGameControl(msg)
        })
    }
    handleGameControl = data => {
        console.log("Game Control:", data)
        if (data == "refreshdb") {
            this.state.mode="active"
            this.setState(this.state)
            this.refreshGame();
        }
    }
    componentDidUpdate() {
        this.setLocalStorage()
    }
    defaultState = {
        mode: "fresh", //fresh, active, waiting, over
        error: "",
        team: {
            team_name: ""
        },
        game: null,
        current_answer_sheet:null,
        bids:[1,3,5,7],
        answer_history: []
    }
    makeBlankAnswerSheet = () => {
        let answers = [5,15].indexOf(this.state.game.current_question) > -1 ? [this.blankAnswer,this.blankAnswer,this.blankAnswer,this.blankAnswer] : [this.blankAnswer]
        return {
            game: this.state.game._id,
            team: this.state.team._id,
            q: this.state.game.current_question,
            answers: answers
        }
    }
    blankAnswer = {
        content:"",
        bid:null
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
    instructionMap = [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 4, 4, 4, 4, 5, 4, 4, 4, 4, 6]
    setLocalStorage = () => {
        if (this.state.game._id != null) {
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
        window.sessionStorage.removeItem("gamestate")
        var f = window.sessionStorage.getItem("gamestate")
    }

    handleDroppedConnection = () => {
        console.log("Connection to host lost")
        this.state.io.socket = null
        this.state.socket.joined = false
        this.setState(this.state)
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
                    console.log(res)
                    if (res.length == 1) {
                        this.state.game = Object.assign({}, this.state.game, res[0])
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
        this.state.team[e.target.name] = e.target.value
        this.setState(this.state);
    }

    handleIntroFormSubmit = e => {
        ApiConnector("addTeam", JSON.stringify({ _id: this.state.game._id, team: { team_name: this.state.team.team_name } }))
            .then(res => {
                console.log(res)
                if (res._id) {
                    this.state.mode = "active"
                    this.state.team = res
                    this.setState(this.state)
                    this.checkForAnswerSheet()
                }
                else {
                    this.state.error = "Problem signing in to game"
                }
            })
    }
    refreshGame = () => {
        let formData = {
            id: this.state.game._id
        }
        ApiConnector("read", JSON.stringify(formData), "game")
            .then(res => {
                this.state.game = Object.assign({}, this.state.game, res)
                this.setState(this.state)
                this.checkForAnswerSheet()
            })
    }
    checkForAnswerSheet = () => {
        if (this.state.current_answer_sheet==null && this.state.game.current_question>0) {
            this.state.current_answer_sheet= this.makeBlankAnswerSheet()
            this.setState(this.state)
            console.log(this.state)
        }
    }
    handleAnswerSubmit = e => {
        e.preventDefault()
        let formData = this.state.current_answer_sheet
        formData.team = this.state.team
        ApiConnector("submitAnswer", JSON.stringify(formData))
            .then(res => {
                this.state.answer_history.push(res)
                this.state.current_answer_sheet=this.makeBlankAnswerSheet()
                this.setState(this.state)
                this.socket.emit("clientmsg", "answerdropped")
            })
        console.log("Answer submitted");
    }
    changeAnswer = (e, numAnswer) => {
        e.preventDefault()
        this.state.current_answer_sheet.answers[numAnswer].content = e.target.value
        this.setState(this.state)
    }
    changeBid = e => {
        this.state.current_answer_sheet.answers[0].bid = e.target.options[e.target.selectedIndex].value
        this.setState(this.state)
    }
    render() {

        return pug`
            if this.state.error!=""
                h2.error=this.state.error
            else
                if this.state.mode=="fresh"
                    IntroForm(
                        game=this.state.game,
                        team=this.state.team,
                        onChange=this.handleFormChange,
                        onSubmit=this.handleIntroFormSubmit
                        )
                if this.state.mode=="active"
                    AnswerForm(
                        game=this.state.game,
                        answer_sheet=this.state.current_answer_sheet,
                        bids=this.state.bids,
                        submitAnswer=this.handleAnswerSubmit,
                        instructions=this.instructionStrings,
                        instructionMap=this.instructionMap,
                        changeAnswer=this.changeAnswer,
                        changeBid=this.changeBid
                    )
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));