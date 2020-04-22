import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import GameSigninForm from './components/game-signin-form'
import AnswerForm from './components/answer-form'
import LoginBar from './components/login-bar'
import ChatBox from './components/chat-box'

import ApiConnector from './components/api-connector'

import io from 'socket.io-client'

/*

    TODO:
     - Make sure game description and nav are present.
     - Make it so that a dupe team name triggers a join or watch cue

*/

class App extends Component {

    constructor(props) {
        super(props)
        this.checkForUser()
        let saveState = this.getLocalStorage()
        this.state = saveState ? saveState : this.defaultState
        this.makeSocketConnection()

        if (saveState) {
            this.refreshGame()
        }
        if (this.state.mode=="fromlobby") {
            this.state.mode="noteam"
            this.getUser()
            this.refreshGame()
        }
        if (this.state.mode="noteam") {
            this.getUser()
        }
        if (this.state.mode == "fromurl") {
            this.getUser()
            this.initGameFromHash()
        }

    }
    checkForUser = () => {
        if (window.sessionStorage.getItem("userstate") == undefined) {
            location.href="login.html"
        }
    }
    getUser = () => {
        this.state.user = JSON.parse(window.sessionStorage.getItem("userstate"))
        this.setState(this.state)
        let queryData={
            id:this.state.game._id,
            userid:this.state.user._id
        }
        ApiConnector("read",JSON.stringify(queryData))
            .then(res=>{
                if (res.error) {
                    this.showMessage("error",res.error)
                }
                else {
                    this.state.team=res
                    this.state.mode="active"
                    this.setState(this.state)
                    this.refreshGame()
                }
            })
    }
    logout = e => {
        e.preventDefault();
        this.state.game={}
        this.state.team={}
        this.setState(this.state)
        window.sessionStorage.removeItem("userstate")
        location.href="login.html"
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

    handleGameControl = msg => {
        console.log("Game Control:", msg)
        if (msg == "refreshdb") {
            this.state.mode = "active"
            this.setState(this.state)
            this.refreshGame();
        }
        else if (msg=="startgame") {
            this.refreshGame();
            this.showMessage("happy","The game has started! Hooray! Hooray for School!")
        }
        else if (typeof msg === "object") {
            if (msg.label=="teamadded" && msg.data._id==this.state.team._id) {
                this.state.mode="active"
                this.setState(this.state)
                this.newAnswerSheet()
                console.log("Joined Game")
            }
        }
    }
    showMessage = (className,msg) => {
        this.state.messages.push({className:className,msg:msg})
        this.setState(this.state)
    }
    componentDidUpdate() {
        this.setLocalStorage()
    }
    defaultState = {
        mode: "fromurl", //fromurl,fromlobby active, waiting, over
        error: "",
        team: {
            team_name: "",
            answer_history:new Array(20)
        },
        game: null,
        current_answer_sheet: null,
        current_bid:1,
        bids: [1, 3, 5, 7],
        messages:[{
            className:"intro",
            msg:"Welcome to the Game!"
        }]
    }
    makeBlankAnswerSheet = qnum => {
        let answers = [this.blankAnswer(null)]
        if (qnum==5) {
            answers = [this.blankAnswer(2),this.blankAnswer(2),this.blankAnswer(2),this.blankAnswer(2)]
        }
        if (qnum==15) {
            answers = [this.blankAnswer(5),this.blankAnswer(5),this.blankAnswer(5),this.blankAnswer(5)]
        }
        return {
            q: this.state.game.current_question,
            answers: answers
        }
    }
    bidRefreshMap = () => {
        return {
            4: [1, 3, 5, 7],
            9: [2, 4, 6, 8],
            14: [2, 4, 6, 8],
        }
    }
    blankAnswer = bid => {
        return {
            content: "",
            bid: bid
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
            console.log("Url",url_hash)
            ApiConnector("read", JSON.stringify({ game_code: url_hash }))
                .then(res => {
                    if (res.length == 1) {
                        this.state.game = Object.assign({}, this.state.game, res[0])
                        this.state.mode="noteam"
                        this.setState(this.state)
                    }
                    else {
                        this.state.error = "No game specified. Bad URL"
                        this.state.mode="noteam"
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
        ApiConnector("addTeam", JSON.stringify({ _id: this.state.game._id, team: { team_name: this.state.team.team_name, users:[this.state.user] } }))
            .then(res => {
                if (res._id) {
                    this.state.mode = "waiting_room"
                    this.state.team = res
                    this.setState(this.state)
                    this.socket.emit("clientmsg", "team joined: "+ this.state.team.team_name)
                }
                else if (res.dupe) {
                    this.state.error = "Duplicate Team name."
                }
                else {
                    this.state.error = "Problem signing in to game"
                }
            })
    }
    refreshGame = () => {
        let formData = {
            id: this.state.game._id,
            teamid: this.state.team._id
        }
        ApiConnector("read", JSON.stringify(formData))
            .then(res => {
                if (res._id) {
                    this.state.game = res
                    this.setState(this.state)
                    this.newAnswerSheet()
                }
                else {
                    console.log(res)
                }
            })
    }
    newAnswerSheet = () => {
        this.state.current_answer_sheet = this.makeBlankAnswerSheet(this.state.game.current_question)
        this.setState(this.state)
    }
    handleAnswerSubmit = e => {
        e.preventDefault()
        let formData = { gameid:this.state.game._id,teamid: this.state.team._id, answer_sheet: this.state.current_answer_sheet }
        ApiConnector("submitAnswer", JSON.stringify(formData))
            .then(res => {
                this.state.answer_history = res.data
                this.state.current_answer_sheet = null
                this.setState(this.state)
                this.socket.emit("clientmsg", "answerdropped")
                console.log("Answer submitted", res);
            })
    }
    changeAnswer = (e, numAnswer) => {
        e.preventDefault()
        this.state.current_answer_sheet.answers[numAnswer].content = e.target.value
        this.setState(this.state)
    }
    changeBid = e => {
        this.state.current_answer_sheet.answers[0].bid = e.target.options[e.target.selectedIndex].value
        this.state.current_bid = e.target.options[e.target.selectedIndex].value
        this.setState(this.state)
        console.log("Bid chnaged", this.state)
    }
    render() {

        return pug`
            #wrapper
                if this.state.error!=""
                    h2.error=this.state.error
                else
                    LoginBar(
                        user=this.state.user,
                        logout=this.logout
                        )
                    if this.state.mode=="noteam"
                        GameSigninForm(
                            game=this.state.game,
                            team=this.state.team,
                            onChange=this.handleFormChange,
                            onSubmit=this.handleIntroFormSubmit
                            )
                    if this.state.mode=="active" || this.state.mode=="waiting_room"
                        AnswerForm(
                            mode=this.state.mode,
                            game=this.state.game,
                            team=this.state.team,
                            answer_sheet=this.state.current_answer_sheet,
                            bids=this.state.bids,
                            currentBid=this.state.current_bid,
                            submitAnswer=this.handleAnswerSubmit,
                            instructions=this.instructionStrings,
                            instructionMap=this.instructionMap,
                            changeAnswer=this.changeAnswer,
                            changeBid=this.changeBid
                        )
                    ChatBox(
                        messages=this.state.messages
                    )
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));