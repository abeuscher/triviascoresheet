import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import GameSigninForm from './components/game-signin-form'
import AnswerForm from './components/answer-form'
import LoginBar from './components/login-bar'
import ClientChat from './components/client-chat'
import DefaultGameState from '../common-js/default-game-state'

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
        if (saveState) {
            this.state.joined_game_chat = false
        }
    }
    checkForUser = () => {
        if (window.sessionStorage.getItem("userstate") == undefined) {
            location.href = "login.html"
        }
    }
    getUser = () => {
        this.state.user = JSON.parse(window.sessionStorage.getItem("userstate"))
        this.setState(this.state)
        let queryData = {
            id: this.state.game._id,
            userid: this.state.user._id
        }
        ApiConnector("read", JSON.stringify(queryData))
            .then(res => {
                if (!res.error) {
                    this.state.mode = res.status
                    this.state.team = res.data
                    this.setState(this.state)
                    this.refreshGame()
                }
            })
    }
    logout = e => {
        e.preventDefault();
        this.state.game = {}
        this.state.team = {}
        this.setState(this.state)
        window.sessionStorage.removeItem("userstate")
        location.href = "login.html"
    }
    socket = io('http://teamtrivia.localapi:5000')
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            console.log("sending", {
                gameid: this.state.game._id,
                teamid: this.state.team._id,
                userid: this.state.user._id,
                username: this.state.user.username
            })
            this.socket.emit("clientjoin", {
                gameid: this.state.game._id,
                teamid: this.state.team._id,
                userid: this.state.user._id,
                username: this.state.user.username
            })

            this.socket.on("gamechat", msg => {
                this.getMessage("gamechat", msg)
            })
            this.socket.on("gamestatus", msg => {
                this.getMessage("gamestatus", msg)
                this.handleGameControl(msg)
            })
            this.socket.on("playerchat", msg => {
                this.getMessage("player", msg)
            })
            this.socket.on("hostchat", msg => {
                this.getMessage("host", msg)
            })
            this.socket.on('disconnect', () => {
                console.log("Socket dropped")
            });
            this.state.joined_game_chat = true;
            this.setState(this.state)
            console.log("Socket connected")
        });



    }
    sendMessage = (dest, msg) => {
        console.log("Send message", dest, msg)
        this.socket.emit(dest, {
            gameid: this.state.game._id,
            teamid: this.state.team._id,
            userid: this.state.user._id,
            username: this.state.user.username,
            msg: msg,
            status: "unread"
        })
    }
    getMessage = (dest, data) => {
        console.log(dest, data)
        this.state.io[dest].messages.push(data)
        this.setState(this.state)
    }

    handleDroppedConnection = () => {
        console.log("Connection to host lost. Reconnecting...")
        this.socket = io('http://teamtrivia.localapi:5000')
        this.setState(this.state)
    }
    handleGameControl = data => {
        if (data.action=="refresh") {
            this.refreshGame()
        }
        if (data.action=="teamadded") {
            if (data._id==this.state.team._id) {
                this.state.io.gamestatus.messages.push({className:"local",msg:"You have been added to the game"})
                this.state.mode="active"
                this.setState(this.state)
            }
        }
    }
    showMessage = (className, msg) => {
        this.state.io.gamestatus.messages.push({ className: className, msg: msg })
        this.setState(this.state)
    }
    componentDidMount() {

        if (this.state.mode == "fromlobby") {
            this.state.mode = "noteam" 
            this.getUser()
            this.refreshGame()
            this.state.joined_game_chat = false
            this.setState(this.state)
        }
        if (this.state.mode = "noteam") {
            this.getUser()
        }
        if (this.state.mode == "fromurl") {
            this.getUser()
            this.initGameFromHash()
            this.state.joined_game_chat = false
            this.setState(this.state)
        }
    }
    componentDidUpdate() {
        if (!this.state.joined_game_chat) {
            this.makeSocketConnection()
        }
        this.setLocalStorage()
    }
    defaultState = DefaultGameState("fromurl")
    makeBlankAnswerSheet = qnum => {
        let answers = [this.blankAnswer(null)]
        if (qnum == 5) {
            answers = [this.blankAnswer(2), this.blankAnswer(2), this.blankAnswer(2), this.blankAnswer(2)]
        }
        if (qnum == 15) {
            answers = [this.blankAnswer(5), this.blankAnswer(5), this.blankAnswer(5), this.blankAnswer(5)]
        }
        return {
            q: this.state.game.current_question,
            answers: answers
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


    initGameFromHash = () => {
        let url_hash = this.getUrlParameter("pqid")
        if (!url_hash) {
            this.state.error = "No game specified. Bad URL"
            this.setState(this.state)
        }
        else {
            console.log("Url", url_hash)
            ApiConnector("read", JSON.stringify({ game_code: url_hash }))
                .then(res => {
                    if (res.length == 1) {
                        this.state.game = Object.assign({}, this.state.game, res[0])
                        this.state.mode = "noteam"
                        this.setState(this.state)
                    }
                    else {
                        this.state.error = "No game specified. Bad URL"
                        this.state.mode = "noteam"
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
    changeChat = e => {
        e.preventDefault()
        this.state.io[e.target.getAttribute("data-key")].current_message = e.target.value
        this.setState(this.state)
    }
    sendChat = e => {
        e.preventDefault()
        this.sendMessage(e.target.getAttribute("data-key"), this.state.io[e.target.getAttribute("data-key")].current_message)
        //this.state.io[e.target.getAttribute("data-key")].messages.push({msg:"Message Sent.",className:"gameactivity"})
        this.state.io[e.target.getAttribute("data-key")].current_message = ""
        this.setState(this.state)
    }
    markMessagesAsRead = e => {
        let theKey = e.target.getAttribute("data-key")
        console.log(this.state.io[e.target.getAttribute("data-key")].messages)
        Object.keys(this.state.io[theKey].messages).map((data, key) => {
            this.state.io[theKey].messages[key].status = "read"
        })
        this.setState(this.state)
    }
    handleIntroFormSubmit = e => {
        ApiConnector("addTeam", JSON.stringify({ _id: this.state.game._id, team: { team_name: this.state.team.team_name, users: [this.state.user] } }))
            .then(res => {
                if (res._id) {
                    this.state.mode = "waiting_room"
                    this.state.team = res
                    this.state.team.answer_history = []
                    this.setState(this.state)
                    this.socket.emit("gamestatus", {gameid:this.state.game._id,action:"hostrefresh",type:"teamjoined",team_name:this.state.team.team_name})
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
            id: this.state.game._id
        }
        ApiConnector("read", JSON.stringify(formData))
            .then(res => {
                if (res._id) {
                    this.state.game = res
                    this.setState(this.state)
                    this.checkBids()
                    this.newAnswerSheet()
                }
                else {
                    console.log(res)
                }
            })
    }
    updateTeam = () => {
        ApiConnector("update", JSON.stringify(this.state.team), "team")
            .then(res => {
                if (res.error) {
                    this.showMessage("error", res.error)
                }
                else {
                    this.state.team = res
                    this.setState(this.state)
                }
            })
    }
    newAnswerSheet = () => {
        if (this.state.team.answer_history.filter(answer => { return answer.q == this.state.game.current_question }).length == 0) {
            this.state.current_answer_sheet = this.makeBlankAnswerSheet(this.state.game.current_question)
            this.setState(this.state)
            this.checkBids()
        }
        else {
            this.state.current_answer_sheet = null
            this.setState(this.state)
        }
    }
    handleAnswerSubmit = e => {
        e.preventDefault()

        let answerSheet = this.state.current_answer_sheet
        if ([5, 15].indexOf(this.state.game.current_question) == -1) {
            console.log("add bid")
            answerSheet.answers[0].bid = this.state.current_bid
        }
        console.log(answerSheet, this.state.current_bid)
        let formData = { gameid: this.state.game._id, teamid: this.state.team._id, answer_sheet: answerSheet }
        ApiConnector("submitAnswer", JSON.stringify(formData))
            .then(res => {
                this.state.tea
                if (res.error) {
                    console.log(res.error)
                }
                else {
                    this.state.team.answer_history.push({ q: this.state.game.current_question, bid: this.state.current_bid })
                    this.state.current_answer_sheet = null
                    this.setState(this.state)
                    this.updateTeam()
                    this.checkBids()
                    this.socket.emit("gamestatus", {gameid:this.state.game._id,action:"hostrefresh",type:"answersubmit"})
                }
            })
    }
    checkBids = () => {
        if ((this.state.game.current_question + 1) % 5 == 0) {
            console.log("Bonus question")
        }
        else {
            let tempBids = []
            if (this.state.game.current_question == 10) {
                tempBids = [2, 4, 6, 8, 10]
            }
            else if (this.state.game.current_question == 20) {
                tempBids = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
            }
            else {
                tempBids = this.state.game.current_question < 10 ? [1, 3, 5, 7] : [2, 4, 6, 8]
                let questions = [[1, 2, 3, 4], [6, 7, 8, 9], [11, 12, 13, 14], [16, 17, 18, 19]][parseInt(this.state.game.current_question / 5)]
                this.state.team.answer_history.forEach(answer => {
                    if (questions.indexOf(answer.q) > -1) {
                        tempBids.splice(tempBids.indexOf(answer.bid), 1)
                    }
                })
            }

            this.state.bids = tempBids
            this.state.current_bid = tempBids[0]
            this.setState(this.state)
        }
    }
    changeAnswer = (e, numAnswer) => {
        e.preventDefault()
        this.state.current_answer_sheet.answers[numAnswer].content = e.target.value
        this.setState(this.state)
    }
    changeBid = e => {
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
                    .flex
                        .column.three-fifth
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
                        .column.two-fifth.chat-bucket
                            ClientChat(
                                io=this.state.io,
                                markMessagesAsRead=this.markMessagesAsRead,
                                changeChat=this.changeChat,
                                sendChat=this.sendChat
                            )
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));