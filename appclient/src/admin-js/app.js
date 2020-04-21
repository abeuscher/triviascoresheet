import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import WysiwygInput from './components/form-fields/wysiwyg-input'
import DateInput from './components/form-fields/date-input'

import ApiConnector from './components/api-connector'

import AdminNav from './components/admin-nav'
import GameForm from './components/game-form'
import GameManager from './components/game-manager'
import Scoresheet from './components/scoresheet'
import AnswerBasket from './components/answer-basket'
import WaitingRoom from './components/waiting-room'

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
        this.state = saveState ? saveState : this.defaultState;
        this.makeSocketConnection()

        if (saveState) {
            this.refreshGame()
        }

    }
    componentDidMount() {
        if (this.state.mode == "manager") {
            this.launchManager();
        }
    }
    socket = io('http://teamtrivia.localapi:5000')
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit("identify host", "Hey guys!")
            console.log("Socket connected")
        });
        this.socket.on('disconnect', function () {
            console.log("Socket lost")
        });
        this.socket.on("clientmsg", msg => {
            this.handleClient(msg)
        })
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
        }
    }
    adminButtons = () => {
        return [{
            label: "Manage Games",
            action: this.launchManager
        }, {
            label: "Create New Game",
            action: this.newGame
        }]
    }
    setLocalStorage = () => {
        if (this.state.game._id != null) {
            console.log("Save to local storage")
            window.sessionStorage.setItem("adminstate", JSON.stringify(this.state));
        }
    }

    getLocalStorage = () => {
        if (window.sessionStorage.getItem("adminstate") != undefined) {
            return JSON.parse(window.sessionStorage.getItem("adminstate"))
        }
        return false
    }

    wipeLocalStorage = () => {
        window.sessionStorage.removeItem("adminstate")
        var f = window.sessionStorage.getItem("adminstate")
    }
    handleClient = msg => {
        if (msg == "answerdropped") {
            this.refreshGame();
        }
    }
    componentDidUpdate() {
        this.setLocalStorage()
    }
    onTimeChange = e => {
        console.log(e);
        this.state.game.start_time = e.toString()
        this.setState(this.state)
    }
    launchManager = () => {
        this.state.mode = "manager"
        this.setState(this.state)
        this.fetchGames()
    }
    newGame = () => {
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
        console.log("I could delete this record:", record)
    }
    playGame = game => {
        this.state.game = game
        this.refreshGame()
        this.state.mode = "play"
        this.setState(this.state)
    }
    createGame = e => {
        e.preventDefault()
        let formData = JSON.stringify(this.state.game);
        ApiConnector("createGame", formData)
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
    addTeamToSheet = team => {
        this.state.game.waiting_room = this.state.game.waiting_room.filter(t => { return t._id != team._id })
        this.state.game.scoresheet.push({
            team: team,
            scored_sheets: []
        })
        this.setState(this.state)
        this.saveGame()
    }
    refreshGame = () => {
        let formData = {
            id: this.state.game._id
        }
        ApiConnector("getGame", JSON.stringify(formData), "game")
            .then(res => {
                console.log("Game from DB:",res)
                this.state.game = res
                this.setState(this.state)
                this.labelAnswerSheets()
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
        console.log(this.state.game.answer_basket[basket_idx].answer_sheet.answers[answer_idx])
        this.state.game.answer_basket[basket_idx].answer_sheet.answers[answer_idx].correct = e.target.checked
        this.setState(this.state)
    }
    scoreAnswer = answer_idx => {
        let thisTeam = this.state.game.answer_basket[answer_idx].team
        this.state.game.scoresheet.forEach(row => {
            console.log("This Answer Sheet:", this.state.game.answer_basket[answer_idx])
            if (row.team._id == thisTeam._id) {
                row.scored_sheets.push(this.state.game.answer_basket[answer_idx].answer_sheet)
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

        this.state.game.scoresheet.forEach((row,idx)=>{
            row.scored_sheets.forEach((sheet,sheet_idx)=>{
                if (sheet._id==answerSheet._id) {
                    rowIndex = idx;
                    qIndex=sheet_idx;
                    thisTeam = row.team;                    
                }
            })
        })

        this.state.game.scoresheet[rowIndex].scored_sheets.splice(qIndex,1);
        this.state.game.answer_basket.push({team:thisTeam,answer_sheet:answerSheet})
        this.setState(this.state)
        this.saveGame()
    }
    saveGame = () => {
        ApiConnector("updateGame", JSON.stringify(this.state.game))
            .then(res => {
                this.state.game = res
                this.setState(this.state)
            })
    }
    changeQuestion = newQ => {
        console.log("Go to q " + newQ, this.state)
        this.state.game.current_question = newQ
        this.setState(this.state)
        ApiConnector("updateGame", JSON.stringify(this.state.game))
            .then(res => {
                this.state.game=res
                this.setState(this.state)
                this.socket.emit("gamecontrol", "refreshdb")
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
    render() {
        return pug`
            AdminNav(
                mode=this.state.mode,
                game=this.state.game,
                changeQuestion=this.changeQuestion,
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
                else
                    
                    if this.state.mode=="edit"
                        .padded-column
                            h3 Player Link:
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
                            addTeamToSheet=this.addTeamToSheet
                        )
                        AnswerBasket(
                            answers=this.state.game.answer_basket,
                            scores=this.state.game.scoresheet,
                            tickAnswer=this.tickAnswer,
                            scoreAnswer=this.scoreAnswer
                        )
                        Scoresheet(
                            game=this.state.game,
                            sendToBasket=this.sendToBasket
                        )
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));