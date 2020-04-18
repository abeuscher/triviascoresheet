import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import IntroForm from './components/intro-form'
import GameForm from './components/game-form'

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
        super(props);
        let saveState = this.getLocalStorage();
        this.state = saveState ? saveState : this.defaultState;
    }

    componentDidMount() {
        if (this.state.mode == "fresh") {
            this.initGameFromHash()
        }
        if (!this.state.io.socket) {
            this.state.io.socket = this.startIO()
            this.setState(this.state)
            this.state.io.socket.on('connect', () => {
                console.log("Socket connected")

            });
            this.state.io.socket.on('disconnect', function () {
                this.handleDroppedConnection()
            });
            this.state.io.socket.on('gamecontrol', data => {
                this.handleGameControl(data);
            });
            this.state.io.socket.emit("host message", "New team joining...")
            
        }

    }
    startIO = () => {
        return io('http://teamtrivia.localapi:5000');
    }
    handleGameControl = data => {
        if (data=="refreshdb") {
            this.refreshGame();
        }
        console.log(data)
    }
    componentDidUpdate() {
        this.setLocalStorage()
        if (this.state.io.socket && !this.state.io.joined && this.state.game.team_name != "") {
            this.state.io.socket.emit("host message", this.state.game.team_name + " has signed in")
            this.state.io.joined = true;
            this.setState(this.state)
        }
    }
    defaultState = {
        mode: "fresh", //fresh, active, over
        error: "",
        io: {
            socket: null,
            joined: false
        },
        game: {
            team_name: "BLANK",
            _id: null,
            game_title: "",
            game_details: "",
            start_time: null,
            round: 0,
            question: 0,
            score: {
                history: [],
                current_score: 0
            },
            bids: [1, 3, 5, 7],
            current_answer: "",
            current_bid: null
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
    instructionMap = [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 4, 4, 4, 4, 5, 4, 4, 4, 4, 6]
    setLocalStorage = () => {
        let tempState = this.state;
        tempState.io.socket = null;
        tempState.io.joined = false;
        if (this.state.game._id != null) {
            window.sessionStorage.setItem("gamestate", JSON.stringify(tempState));
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
        let newValue = e.target.value
        let name = e.target.name
        this.state.game[name] = newValue
        this.setState(this.state);
    }

    handleIntroFormSubmit = e => {
        console.log("Add Team", this.state);
        ApiConnector("addTeam", JSON.stringify({ id: this.state.game._id, team_name: this.state.game.team_name }))
            .then(res => {
                console.log(res)
                if (res.game) {
                    this.state.mode = "active"
                    this.setState(this.state)
                }

            })
    }
    refreshGame = () => {
        let formData = {
            id:this.state.game._id
        }
        ApiConnector("read",JSON.stringify(formData),"game")
            .then(res=>{
                console.log(res);
            })
    }
    handleAnswerSubmit = e => {
        e.preventDefault()
        let answerData = {
            id: this.state.game._id,
            answer: {
                team_name: this.state.game.team_name,
                q: this.state.game.current_question,
                answer: this.state.current_answer,
                bid: this.state.current_bid
            }
        }
        ApiConnector("submitAnswer", JSON.stringify(answerData))
            .then(res => {
                console.log(res);
            })
        console.log("Answer submitted");
    }
    changeAnswer = e => {
        this.state.current_answer=e.target.value
        this.setState(this.state)
    }
    changeBid = e => {
        this.state.current_bid=e.target.options[e.target.selectedIndex].value
        this.setState(this.state)
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
                        instructionMap=this.instructionMap,
                        changeAnswer=this.changeAnswer,
                        changeBid=this.changeBid
                    )
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));