import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import WysiwygInput from './components/form-fields/wysiwyg-input'
import DateInput from './components/form-fields/date-input'

import ApiConnector from './components/api-connector'

import LoginBar from './components/login-bar'
import AdminNav from './components/admin-nav'
import GameForm from './components/game-form'
import GameManager from './components/game-manager'
import UserManager from './components/user-manager'
import Scoresheet from './components/scoresheet'
import AnswerBasket from './components/answer-basket'
import WaitingRoom from './components/waiting-room'
import ChatBox from './components/chat-box'

import Env from '../env'


class App extends Component {

    constructor(props) {
        super(props);
        let saveState = this.getLocalStorage();
        this.state = saveState ? saveState : this.defaultState;
        this.makeSocketConnection()

        if (saveState && this.state.mode == "play") {
            this.refreshGame()
        }

    }

    componentDidMount() {
        this.checkForAdmin()
        if (this.state.mode == "manager") {
            this.launchManager();
        }
    }

    componentDidUpdate() {
        this.setLocalStorage()
    }

    checkForAdmin = () => {
        if (window.sessionStorage.getItem("userstate") == undefined) {
            this.logout()
            return false
        }

        let thisUser = JSON.parse(window.sessionStorage.getItem("userstate"))
        if (thisUser.admin) {
            this.state.user = thisUser
            this.setState(this.state)
            return true
        }
        else {
            this.logout()
            return false
        }
    }


    socket = io(Env().api)
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit("identify host", "Hey guys!")
            this.socket.emit("hostjoin", {
                gameid: this.state.game._id,
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
            console.log("Socket connected")
        });
        this.socket.on('disconnect', function () {
            console.log("Socket lost")
        });
    }
    handleGameControl = msg => {
        if (msg.action == "hostrefresh") {
            this.refreshGame()
        }
    }
    defaultState = {
        mode: "manager", // "create","play","manager"
        games: [],
        game: {
            _id: null,
            game_title: "",
            start_time: new Date(),
            game_description: "",
            num_questions: 20,
            game_code: "",
            waiting_room: [],
            scoresheet: [],
            answer_basket: []
        },
        io: {
            gamestatus: {
                label: "Game Status",
                messages: [{
                    className: "intro",
                    msg: "This tracks the sequence of events in the game.",
                    data: null,
                    status: "unread"
                }]
            },
            gamechat: {
                label: "Game Chat",
                current_message: "",
                messages: [{
                    className: "intro",
                    msg: "This is the game chat. Messages here are visible to all players in the game.",
                    data: null,
                    status: "unread"
                }]
            }
        }
    }

    adminButtons = () => {
        return [{
            label: "Manage Games",
            action: this.launchManager
        }, {
            label: "Create New Game",
            action: this.newGame
        }, {
            label: "Manage Users",
            action: this.fetchUsers
        }]
    }

    blankAnswer = {
        team: null,
        answer_sheet: {
            status: 'unsubmitted',
            score: 0,
            answers: [],
            created: new Date()
        }
    }

    setLocalStorage = () => {
        window.sessionStorage.setItem("adminstate", JSON.stringify(this.state));
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("adminstate") != undefined) {
            let thisState = JSON.parse(window.sessionStorage.getItem("adminstate", "utf-8"))
            if (typeof thisState.game == "Array") {
                thisState.game = JSON.parse(window.sessionStorage.getItem("adminstate", "utf-8")).game[0]
            }
            return thisState
        }
        return false
    }

    checkForAnswerSheet = () => {
        if (!this.state.game.current_answer.team && this.state.game.answer_basket.length) {
            this.state.game.current_answer = this.state.game.answer_basket.pop()
            this.setState(this.state)
            this.saveGame()
        }
    }

    showMessage = (className, msg) => {
        this.state.io.gamestatus.messages.push({ className: className, msg: msg })
        this.setState(this.state)
    }

    logout = () => {
        window.sessionStorage.removeItem("userstate")
        window.sessionStorage.removeItem("adminstate")
        window.sessionStorage.removeItem("gamestate")
        location.href = "login.html"
    }

    launchManager = e => {
        if (e) {
            e.preventDefault()
        }
        this.state.mode = "manager"
        this.setState(this.state)
        this.fetchGames()
    }
    playGame = game => {
        this.state.game = game
        this.refreshGame()
        this.state.mode = "play"
        this.setState(this.state)
    }
    fetchGames = () => {
        ApiConnector("getGame", "", "game")
            .then(res => {
                this.state.games = res
                this.setState(this.state)
            })
    }
    fetchUsers = () => {
        ApiConnector("get", "", "user")
            .then(res => {
                this.state.mode = "usermanager"
                this.state.users = res
                this.setState(this.state)
            })
    }
    newGame = e => {
        if (e) {
            e.preventDefault()
        }
        this.state.mode = "create"
        this.state.game = this.defaultState.game
        this.setState(this.state)
    }
    beginGame = () => {
        this.state.game.game_status = "running"
        this.state.game.current_question = 1
        this.setState(this.state)
        this.saveGame();
        this.socket.emit("gamestatus", { gameid: this.state.game._id, action: "refresh", msg: "The game has started! Huzzah!" })
    }
    createGame = e => {
        e.preventDefault()
        ApiConnector("create", JSON.stringify(this.state.game), "game")
            .then(res => {
                this.state.game = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    editGame = record => {
        this.state.mode = "edit"
        this.state.game = record
        this.setState(this.state)
    }
    deleteGame = record => {
        if (confirm("Are you sure you want to delete this game?")) {
            ApiConnector("delete", JSON.stringify(record), "game")
                .then(res => {
                    if (res.deleted) {
                        this.fetchGames()
                    }
                    else {
                        console.log(res)
                    }
                })
        }
    }
    deleteTeam = team => {
        if (confirm("Are you sure you want to remove this team from the game?")) {
            ApiConnector("delete", JSON.stringify(team), "team")
                .then(res => {
                    this.state.game.waiting_room = this.state.game.waiting_room.filter(item => { return item._id != team._id })
                    this.state.game.scoresheet = this.state.game.scoresheet.filter(item => { return item.team._id != team._id })
                    this.setState(this.state)
                    this.socket.emit("gamestatus", { gameid: this.state.game._id, action: "teamdeleted", data: team })
                })
        }
    }
    deleteAnswer = () => {
        if (confirm("Are you sure? The team will need to submit a new answer")) {
            ApiConnector("deleteAnswer", JSON.stringify(this.state.game.current_answer))
                .then(res => {
                    let clientMsg = { gameid: this.state.game._id, action: "answerdeleted", data: this.state.game.current_answer.team._id };

                    if (this.state.game.answer_basket.length>0) {
                        this.state.game.current_answer = this.state.game.answer_basket.pop()
                    }
                    else {
                        this.state.game.current_answer = this.blankAnswer
                    }
                    this.setState(this.state)
                    this.saveGame()
                    this.socket.emit("gamestatus", clientMsg)
                })
        }
    }
    refreshGame = () => {
        let formData = {
            id: this.state.game._id
        }
        ApiConnector("getGame", JSON.stringify(formData), "game")
            .then(res => {
                this.state.game = res
                this.setState(this.state)
                this.checkForAnswerSheet()
            })
    }
    onTimeChange = e => {
        this.state.game.start_time = e.toString()
        this.setState(this.state)
    }
    onFieldChange = e => {
        this.state.game[e.target.name] = e.target.value
        this.setState(this.state)
    }
    onWysiwygChange = output => {
        this.state.game.game_description = output
        this.setState(this.state)
    }
    onSelectChange = e => {
        this.state.game.num_questions = e.target.options[e.target.selectedIndex].value
        this.setState(this.state)
    }
    changeChat = e => {
        e.preventDefault()
        this.state.io[e.target.getAttribute("data-key")].current_message = e.target.value
        this.setState(this.state)
    }

    chatkeyDown = e => {
        if (e.key == "Enter") {
            e.preventDefault()
            this.sendChat()
        }
    }
    sendChat = e => {
        let sendValue = null
        let sendTarget = null
        if (e) {
            e.preventDefault()
            sendValue = this.state.io[e.target.getAttribute("data-key")].current_message
            sendTarget = e.target.getAttribute("data-key")
            this.state.io[e.target.getAttribute("data-key")].current_message = ""
        }
        else {
            sendValue = this.state.io.gamechat.current_message
            sendTarget = "gamechat"
            this.state.io.gamechat.current_message = ""
        }

        this.sendMessage(sendTarget, sendValue)
        this.setState(this.state)
    }


    addTeamToSheet = team => {
        this.state.game.waiting_room = this.state.game.waiting_room.filter(t => { return t._id != team._id })
        this.state.game.scoresheet.push({
            team: team,
            scored_sheets: []
        })
        this.setState(this.state)
        this.saveGame()
        this.socket.emit("gamestatus", { gameid: this.state.game._id, action: "teamadded", data: team })
    }
    sendTeamToWaitingRoom = team => {
        if (confirm("Are you sure you want to remove this team from the game? All of their answers up to this point will be lost. Forever. Seriously.")) {
            this.state.game.scoresheet = this.state.game.scoresheet.filter(t => { return t.team._id != team._id })
            this.state.game.waiting_room.push(team)
            this.socket.emit("gamestatus", { gameid: this.state.game._id, action: "teamremoved", data: team })
            this.setState(this.state)
            this.saveGame()
        }
    }
    tickAnswer = (e, answer_idx) => {
        let calculatedScore = 0;
        this.state.game.current_answer.answer_sheet.answers[answer_idx].correct = e.target.checked
        if (this.state.game.current_answer.answer_sheet.q % 10 == 0) {
            calculatedScore = (this.state.game.current_answer.answer_sheet.answers[0].correct ? this.state.game.current_answer.answer_sheet.answers[0].bid : -1 * (this.state.game.current_answer.answer_sheet.answers[0].bid / 2))
        }
        else {
            this.state.game.current_answer.answer_sheet.answers.forEach(answer => {
                calculatedScore += answer.correct ? answer.bid : 0
            })
        }
        this.state.game.current_answer.answer_sheet.score = calculatedScore
        this.setState(this.state)
    }
    changeScore = e => {
        e.preventDefault()
        this.state.game.current_answer.answer_sheet.score = e.target.value
        this.setState(this.state)
    }
    scoreAnswer = () => {
        let thisSheet = this.state.game.current_answer.answer_sheet
        thisSheet.status = "scored"
        let calculatedScore = 0
        if (thisSheet.q % 10 == 0) {
            calculatedScore = (thisSheet.answers[0].correct ? thisSheet.answers[0].bid : -1 * (thisSheet.answers[0].bid / 2))
        }
        else {
            thisSheet.answers.forEach(answer => {
                calculatedScore += answer.correct ? answer.bid : 0
            })
        }

        if (thisSheet.score != calculatedScore && thisSheet.score != 0) {
            thisSheet.status = "override"
        }
        else {
            thisSheet.score = calculatedScore
            thisSheet.status = "scored"
        }
        let rowIndex = null;
        this.state.game.scoresheet.forEach((row, idx) => {
            if (row.team._id == this.state.game.current_answer.team._id) {
                rowIndex = idx
            }
        })
        this.state.game.scoresheet[rowIndex].scored_sheets.push(thisSheet)

        // Autocorrects all similar answers in answer basket
        thisSheet.answers.forEach(currentAnswer => {
            this.state.game.answer_basket.forEach((answer, idx) => {
                answer.answer_sheet.answers.forEach(a => {
                    if (answer.answer_sheet.q == thisSheet.q && a.content.toLowerCase() == currentAnswer.content.toLowerCase()) {
                        a.correct = currentAnswer.correct
                        if ([5, 15].indexOf(answer.answer_sheet.q) < 0) {
                            this.state.game.scoresheet.forEach((row, rowIndex) => {
                                if (row.team._id == answer.team._id) {
                                    this.state.game.scoresheet[rowIndex].scored_sheets.push(answer.answer_sheet)
                                    this.state.game.answer_basket.splice(idx, 1)
                                }
                            })
                        }
                    }
                })
            })
        })

        if (this.state.game.answer_basket.length) {
            this.state.game.current_answer = this.state.game.answer_basket.pop()
        }
        else {
            this.state.game.current_answer = this.blankAnswer
        }
        this.setState(this.state)
        this.saveGame()
    }
    sendToBasket = e => {

        e.preventDefault()

        let el = e.target.hasAttribute("data-row-index") ? e.target : e.target.parentNode
        let rowIndex = parseInt(el.getAttribute("data-row-index"))
        let qNumber = parseInt(el.getAttribute("data-question-number"))

        let answerSheet = this.state.game.scoresheet[rowIndex].scored_sheets.filter(sheet => { return sheet.q == qNumber })[0]
        let thisTeam = this.state.game.scoresheet[rowIndex].team;

        if (this.state.game.current_answer.answer_sheet.q) {
            this.state.game.answer_basket.push(this.state.game.current_answer)
        }
        this.state.game.current_answer = { team: thisTeam._id, answer_sheet: answerSheet }
        this.state.game.scoresheet[rowIndex].scored_sheets = this.state.game.scoresheet[rowIndex].scored_sheets.filter(sheet => { return sheet.q != qNumber })
        this.setState(this.state)
        this.saveGame()
    }
    saveGame = (cb) => {
        ApiConnector("updateGame", JSON.stringify(this.state.game))
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                }
                else {
                    this.state.game = res
                    this.setState(this.state)
                    if (cb) {
                        cb()
                    }
                }
            })
    }
    changeQuestion = e => {
        e.preventDefault()
        this.state.game.current_question = e.target.classList.contains("previous-question") ? this.state.game.current_question - 1 : this.state.game.current_question + 1
        this.setState(this.state)
        this.saveGame(() => {
            this.socket.emit("gamestatus", { gameid: this.state.game._id, type: "control", action: "refresh", msg: "Beginning Question #" + this.state.game.current_question })
        })
    }
    getMessage = (dest, data) => {
        this.state.io[dest].messages.push(data)
        this.setState(this.state)
    }
    sendMessage = (dest, msg) => {
        this.socket.emit(dest, {
            gameid: this.state.game._id,
            userid: this.state.user._id,
            username: this.state.user.username,
            host: true,
            msg: msg,
            status: "unread"
        })
    }


    changeUserPrivileges = e => {
        this.state.users[e.target.getAttribute("data-idx")][e.target.name] = e.target.checked;
        this.setState(this.state)
        ApiConnector("update", JSON.stringify(this.state.users[e.target.getAttribute("data-idx")]), "user")
            .then(res => {
                this.fetchUsers()
            })
    }
    deleteUser = user => {
        if (confirm("Are you sure you want to delete this user?")) {
            ApiConnector("delete", JSON.stringify(user), "user")
                .then(res => {
                    this.fetchUsers()
                })
        }
    }
    render() {
        return pug`
            LoginBar(
                user=this.state.user,
                logout=this.logout,
                adminButtons=this.adminButtons()
            )
            header.page-header
                .logo
                    img(src="/images/logo.png")
                .site-title
                    h1 Online Pub Trivia
            AdminNav(
                mode=this.state.mode,
                game=this.state.game,
                changeQuestion=this.changeQuestion,
                beginGame=this.beginGame
            )
            #wrapper 
                if this.state.mode=="manager"
                    GameManager(
                        games=this.state.games,
                        editGame=this.editGame,
                        playGame=this.playGame,
                        deleteGame=this.deleteGame
                        )
                else if this.state.mode=="usermanager"
                    UserManager(
                        users=this.state.users,
                        changeUserPrivileges=this.changeUserPrivileges,
                        deleteUser=this.deleteUser
                    )
                else
                    if this.state.mode=="edit" || this.state.mode=="create"
                        GameForm(
                            game=this.state.game,
                            onWysiwygChange=this.onWysiwygChange,
                            onFieldChange=this.onFieldChange,
                            onTimeChange=this.onTimeChange,
                            onSelectChange=this.onSelectChange,
                            onCodesChange=this.onCodesChange,
                            mode=this.state.mode
                            createGame=this.createGame,
                            saveGame=this.saveGame
                            )
                    if this.state.mode=="play"
                        Scoresheet(
                            game=this.state.game,
                            sendToBasket=this.sendToBasket,
                            sendTeamToWaitingRoom=this.sendTeamToWaitingRoom
                        )
                        .flex
                            .column.half
                                AnswerBasket(
                                    total=this.state.game.answer_basket.length,
                                    current_sheet=this.state.game.current_answer,
                                    scores=this.state.game.scoresheet,
                                    tickAnswer=this.tickAnswer,
                                    scoreAnswer=this.scoreAnswer,
                                    deleteAnswer=this.deleteAnswer,
                                    changeBid=this.changeBid,
                                    changeScore=this.changeScore
                                )                            
                                WaitingRoom(
                                    waiting_room=this.state.game.waiting_room,
                                    addTeamToSheet=this.addTeamToSheet,
                                    deleteTeam=this.deleteTeam
                                )
                            .column.half
                                ChatBox(
                                    io=this.state.io,
                                    changeChat=this.changeChat,
                                    sendChat=this.sendChat,
                                    chatkeyDown=this.chatkeyDown
                                )               
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));