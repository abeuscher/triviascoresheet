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
/*

    App flow:
     - User enters team name
     - Game present twenty answers in a row.
     - App should check for current question number and not allow new submissions until it's time.
     - It would be nice to have a server triggered client side timer
     - Also should feature: Game Zoom Link, have space for other materials like PDFS or whatever.

    Next Steps:
      - Fix Client Bidding to be fool proof
      - Add checks for dupe answer sheets
      - Look into enabling basic chat
      - Look for deploy solutions
        

*/
class App extends Component {

    constructor(props) {
        super(props);
        let saveState = this.getLocalStorage();
        console.log("Saved State:",saveState)
        this.state = saveState ? saveState : this.defaultState;
        this.makeSocketConnection()

        if (saveState && this.state.mode=="play") {
            this.refreshGame()
        }

    }
    checkForAdmin = () => {
        if (window.sessionStorage.getItem("userstate") == undefined) {
            location.href = "login.html"
            return false
        }

        let thisUser = JSON.parse(window.sessionStorage.getItem("userstate"))
        if (thisUser.admin) {
            this.state.user = thisUser
            this.setState(this.state)
            return true
        }
        else {
            location.href = "login.html"
            return false
        }
    }
    componentDidMount() {
        this.checkForAdmin()
        if (this.state.mode == "manager") {
            this.launchManager();
        }
    }
    socket = io('http://teamtrivia.localapi:5000')
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit("identify host", "Hey guys!")
            this.socket.emit("hostjoin", {
                gameid: this.state.game._id,
                userid:this.state.user._id,
                username:this.state.user.username
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
        console.log("Game Control:",msg)
        if (msg.action=="hostrefresh") {
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
                    status:"unread"
                }]
            },
            gamechat: {
                label: "Game Chat",
                current_message: "",
                messages: [{
                    className: "intro",
                    msg: "This is the game chat. Messages here are visible to all players in the game.",
                    data: null,
                    status:"unread"
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
        },{
            label: "Manage Users",
            action: this.fetchUsers
        }]
    }
    setLocalStorage = () => {
        window.sessionStorage.setItem("adminstate", JSON.stringify(this.state));
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("adminstate") != undefined) {
            let thisState = JSON.parse(window.sessionStorage.getItem("adminstate","utf-8"))
            if (typeof thisState.game=="Array") {
                thisState.game = JSON.parse(window.sessionStorage.getItem("adminstate","utf-8")).game[0]
            }
            return thisState
        }
        return false
    }

    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("adminstate")
        var f = window.sessionStorage.getItem("adminstate")
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
    componentDidUpdate() {
        this.setLocalStorage()
    }
    onTimeChange = e => {
        console.log(e);
        this.state.game.start_time = e.toString()
        this.setState(this.state)
    }
    launchManager = e => {
        if (e) {
            e.preventDefault()
        }
        this.state.mode = "manager"
        this.setState(this.state)
        this.fetchGames()
    }
    newGame = e => {
        if (e) {
            e.preventDefault()
        }
        this.state.mode = "create"
        this.state.game = this.defaultState.game
        this.state.game.game_code = this.generateCode()
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
    editGame = record => {
        this.state.mode = "edit"
        this.state.game = record
        this.setState(this.state)
    }
    deleteGame = record => {
        if (confirm("Are you sure you want to delete this game?")) {
            ApiConnector("delete",JSON.stringify(record),"game")
                .then(res=>{
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
            ApiConnector("delete",JSON.stringify(team),"team")
                .then(res=>{
                    this.state.game.waiting_room = this.state.game.waiting_room.filter(item=>{return item._id!=team._id})
                    this.state.game.scoresheet = this.state.game.scoresheet.filter(item=>{return item.team._id!=team._id})
                    this.setState(this.state)
                    console.log(res)
                })            
        }        
    }
    playGame = game => {
        this.state.game = game
        this.refreshGame()
        this.state.mode = "play"
        this.setState(this.state)
    }
    beginGame = () => {
        this.state.game.game_status = "running"
        this.state.game.current_question = 1
        this.setState(this.state)
        this.saveGame();
        this.socket.emit("gamestatus", {gameid:this.state.game._id,action:"refresh",msg:"The game has started! Huzzah!"})
    }
    createGame = e => {
        e.preventDefault()
        ApiConnector("create", JSON.stringify(this.state.game),"game")
            .then(res => {
                this.state.game = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    fetchGames = () => {
        ApiConnector("getGame", "", "game")
            .then(res => {
                this.state.games = res
                this.setState(this.state)
                console.log("retrieved games:", res)
            })
    }
    fetchUsers = () => {
        ApiConnector("get","","user")
            .then(res=>{
                console.log("Users:",res)
                this.state.mode="usermanager"
                this.state.users=res
                this.setState(this.state)
            })
    }
    addTeamToSheet = team => {
        this.state.game.waiting_room = this.state.game.waiting_room.filter(t => { return t._id != team._id })
        this.state.game.scoresheet.push({
            team: team,
            scored_sheets: []
        })
        console.log("Emit game data")
        this.socket.emit("gamestatus", { gameid:this.state.game._id,action: "teamadded", data: team })
        this.setState(this.state)
        this.saveGame()
    }
    sendTeamToWaitingRoom = team => {
        if (confirm("Are you sure you want to remove this team from the game? All of their answers up to this point will be lost. Forever. Seriously.")) {
            this.state.game.scoresheet = this.state.game.scoresheet.filter(t => { return t.team._id != team._id })
            this.state.game.waiting_room.push(team)  
            this.socket.emit("gamestatus", { label: "teamremoved", data: team })
            this.setState(this.state)
            console.log("Team moved",this.state, team)
            this.saveGame()            
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
                if (this.state.mode=="play") {
                    this.labelAnswerSheets()
                }
            })
    }
    labelAnswerSheets = () => {
        this.state.game.answer_basket.forEach(answerSheet => {
            let teamID = answerSheet.team._id;
            this.state.game.scoresheet.forEach(row => {
                if (row.team._id == teamID) {
                    answerSheet.team = {
                        _id: teamID,
                        team_name: row.team.team_name
                    }
                }
            })
        })
        this.setState(this.state)
    }
    tickAnswer = (e, basket_idx, answer_idx) => {
        this.state.game.answer_basket[basket_idx].answer_sheet.answers[answer_idx].correct = e.target.checked
        this.setState(this.state)
    }
    scoreAnswer = answer_idx => {
        let thisTeam = this.state.game.answer_basket[answer_idx].team
        this.state.game.scoresheet.forEach(row => {
            if (row.team._id == thisTeam._id) {
                let thisSheet = this.state.game.answer_basket[answer_idx].answer_sheet
                thisSheet.status="scored"

                // Handle bonus questions
                if (thisSheet.q%10==0) {
                    console.log(thisSheet,thisSheet.answers[0].correct ? thisSheet.answers[0].bid : -1 * (thisSheet.answers[0].bid/2))
                    thisSheet.score=(thisSheet.answers[0].correct ? thisSheet.answers[0].bid : -1 * (thisSheet.answers[0].bid/2))
                }
                else {
                    thisSheet.score = 0;
                    thisSheet.answers.forEach(answer=>{
                        thisSheet.score += answer.correct ? answer.bid : 0
                    })
                }
                row.scored_sheets.push(thisSheet)
                this.state.game.answer_basket.splice(answer_idx, 1)
            }
        })
        this.setState(this.state)
        this.saveGame()
    }
    sendToBasket = (e) => {
        e.preventDefault()

        let answerSheet = null
        let rowIndex = null
        let qIndex = null
        let thisTeam = null

        if (!e.target.hasAttribute("data-item")) {
            answerSheet = JSON.parse(e.target.parentNode.getAttribute("data-item"))
        }
        else {
            answerSheet = JSON.parse(e.target.getAttribute("data-item"))
        }
        answerSheet.status = "answer_basket"
        this.state.game.scoresheet.forEach((row, idx) => {
            row.scored_sheets.forEach((sheet, sheet_idx) => {
                if (sheet._id == answerSheet._id) {
                    rowIndex = idx;
                    qIndex = sheet_idx;
                    thisTeam = row.team;
                }
            })
        })

        this.state.game.scoresheet[rowIndex].scored_sheets.splice(qIndex, 1);
        this.state.game.answer_basket.push({ team: thisTeam, answer_sheet: answerSheet })
        this.setState(this.state)
        this.saveGame()
    }
    saveGame = () => {
        ApiConnector("updateGame", JSON.stringify(this.state.game))
            .then(res => {
                if (!res.error) {
                    this.refreshGame()
                }
            })
    }
    changeQuestion = newQ => {
        console.log("Go to q " + newQ, this.state)
        this.state.game.current_question = newQ
        this.setState(this.state)
        ApiConnector("updateGame", JSON.stringify(this.state.game))
            .then(res => {
                if (!res.error) {
                    this.refreshGame()
                    this.socket.emit("gamestatus", {gameid:this.state.game._id,type:"control",action:"refresh",msg:"Beginning Question #" + newQ})
                }
                
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
        console.log("New Token:", hash(seed))
        return hash(seed)
    }
    getMessage = (dest, data) => {
        console.log(dest, data)
        this.state.io[dest].messages.push(data)
        this.setState(this.state)
    }
    sendMessage = (dest, msg) => {
        console.log("Send message",dest,msg)
        this.socket.emit(dest, {
            gameid: this.state.game._id,
            userid: this.state.user._id,
            username: this.state.user.username,
            host:true,
            msg: msg,
            status:"unread"
        })
    }
    changeChat = e => {
        e.preventDefault()
        this.state.io[e.target.getAttribute("data-key")].current_message=e.target.value
        this.setState(this.state)
    }
    sendChat = e => {
        e.preventDefault()
        this.sendMessage(e.target.getAttribute("data-key"),this.state.io[e.target.getAttribute("data-key")].current_message)
        //this.state.io[e.target.getAttribute("data-key")].messages.push({msg:"Message Sent.",className:"gameactivity"})
        this.state.io[e.target.getAttribute("data-key")].current_message=""
        this.setState(this.state)
    }
    markMessagesAsRead = e => {
        let theKey = e.target.getAttribute("data-key")
        console.log(this.state.io[e.target.getAttribute("data-key")].messages)
        Object.keys(this.state.io[theKey].messages).map((data,key)=>{
            this.state.io[theKey].messages[key].status="read"
        })
        this.setState(this.state)
    }
    changeUserPrivileges = e => {
        this.state.users[e.target.getAttribute("data-idx")][e.target.name]=e.target.checked;
        this.setState(this.state)
        ApiConnector("update",JSON.stringify(this.state.users[e.target.getAttribute("data-idx")]),"user")
            .then(res=>{
                this.fetchUsers()
            })  
    }
    deleteUser = user => {
        if (confirm("Are you sure you want to delete this user?")) {
            ApiConnector("delete",JSON.stringify(user),"user")
                .then(res=>{
                    this.fetchUsers()
                })
        }
    }
    render() {
        return pug`
            LoginBar(
                user=this.state.user,
                logout=this.logout
            )
            AdminNav(
                mode=this.state.mode,
                game=this.state.game,
                changeQuestion=this.changeQuestion,
                beginGame=this.beginGame,
                adminButtons=this.adminButtons()
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
                    
                    if this.state.mode=="edit"
                        .padded-column.section-title
                            h2 Player Link:
                        .padded-column
                            p
                                a(href="http://teamtrivia.local/?pqid="+this.state.game.game_code)="http://teamtrivia.local/?pqid="+this.state.game.game_code
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
                        WaitingRoom(
                            waiting_room=this.state.game.waiting_room,
                            addTeamToSheet=this.addTeamToSheet,
                            deleteTeam=this.deleteTeam
                        )
                        AnswerBasket(
                            answers=this.state.game.answer_basket,
                            scores=this.state.game.scoresheet,
                            tickAnswer=this.tickAnswer,
                            scoreAnswer=this.scoreAnswer
                        )
                        Scoresheet(
                            game=this.state.game,
                            sendToBasket=this.sendToBasket,
                            sendTeamToWaitingRoom=this.sendTeamToWaitingRoom
                        )
                        ChatBox(
                            messages=this.state.io,
                            markMessagesAsRead=this.markMessagesAsRead,
                            changeChat=this.changeChat,
                            sendChat=this.sendChat
                        )
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));