import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import WysiwygInput from './components/form-fields/wysiwyg-input'
import DateInput from './components/form-fields/date-input'

import ApiConnector from './components/api-connector'

import GameForm from './components/game-form'
import GameManager from './components/game-manager'
import Scoresheet from './components/scoresheet'
import AnswerBasket from './components/answer-basket'

/*

    App flow:
     - User enters team name
     - Game present twenty answers in a row.
     - App should check for current question number and not allow new submissions until it's time.
     - It would be nice to have a server triggered client side timer
     - Also should feature: Game Zoom Link, have space for other materials like PDFS or whatever.

    Next Steps:
        - Get host to be able to trgiger next questions
        - Add undo / edit feature to answer sheet
        

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
        if (this.state.mode=="manager") {
            this.launchManager();
        }   
    }
    socket = io('http://teamtrivia.localapi:5000')
    makeSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit("identify host","Hey guys!")
            console.log("Socket connected")
        });
        this.socket.on('disconnect', function () {
            console.log("Socket lost")
        });
        this.socket.on("clientmsg",msg => {
            this.handleClient(msg)
        })
    }
    defaultState = {
        mode: "manager", // "create","play","manager"
        games: [],
        io: {
            socket: null,
            joined: false
        },
        game: {
            _id:null,
            game_title: "",
            start_time: new Date(),
            game_description: "",
            num_questions: 20,
            teams:[],
            answer_basket:[]
        }
    }
    setLocalStorage = () => {
        console.log(this.state);
        let tempState = this.state;
        tempState.io.socket = null;
        tempState.io.joined = false;
        if (this.state.game._id != null) {
            console.log("Save to local storage")
            window.sessionStorage.setItem("adminstate", JSON.stringify(tempState));
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
        if (msg=="answerdropped") {
            this.refreshGame();
        }
    }
    componentDidUpdate() {
        this.setLocalStorage()
    }

    startEditMode(recordid) {
        ApiConnector("read", { id: recordid }, "game")
            .then(res.json())
            .then(console.log(res))
    }
    onTimeChange = e => {
        console.log(e);
        this.state.game.start_time = e
        this.setState(this.state)
    }
    launchManager = () => {
        this.state.mode = "manager"
        this.setState(this.state)
        this.fetchGames()
    }
    newGame = () => {
        this.state.mode = "create"
        this.state.game = this.blankRecord
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
        console.log(record)
    }
    playGame = game => {
        this.state.game=game
        this.state.mode="play"
        this.setState(this.state)
    }
    createGame = e => {
        e.preventDefault()
        let formData = JSON.stringify(this.state.game);
        ApiConnector("create", formData, "game")
            .then(res => {
                this.state.game = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    fetchGames = () => {
        ApiConnector("read", "", "game")
            .then(res => {
                console.log(res);
                this.state.games = res
                this.setState(this.state)
            })
    }
    updateGame = e => {
        e.preventDefault();
        let formData = JSON.stringify(this.state.game)
        ApiConnector("update", formData, "game")
            .then(res => {
                this.state.game = res
                this.state.mode = "edit"
                this.setState(this.state)
            })
    }
    refreshGame = () => {
        let formData = {
            id:this.state.game._id
        }
        ApiConnector("read",JSON.stringify(formData),"game")
            .then(res=>{
                this.state.game = Object.assign({},this.state.game,res)
                this.setState(this.state)
            })
    }
    gradeAnswer = (answer,correct) => {
        answer.correct=correct
        let formData = {
            id:this.state.game._id,
            answer:answer
        }
        ApiConnector("scoreanswer",JSON.stringify(formData))
            .then(res=>{
                this.refreshGame()
                console.log(res)
            })
    }
    changeQuestion = newQ => {
        console.log("Go to q " + newQ)
        this.state.game = Object.assign({},this.state.game,{
            current_question:newQ
        })
       
        ApiConnector("update",JSON.stringify(this.state.game),"game")
            .then(res=>{     
                this.state.game = Object.assign({},this.state.game,res)
                this.setState(this.state)
                this.socket.emit("gamecontrol","refreshdb")
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
                    playGame=this.playGame,
                    deleteGame=this.deleteGame
                    )
            else
                
                if this.state.mode=="edit"
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
                        updateGame=this.updateGame
                        )
                if this.state.mode=="play"
                    AnswerBasket(
                        answers=this.state.game.answer_basket,
                        gradeAnswer=this.gradeAnswer
                    )
                    Scoresheet(
                        game=this.state.game,
                        changeQuestion=this.changeQuestion
                    )
        `
    }
}
ReactDOM.render(<App />, document.getElementById('admin-app'));