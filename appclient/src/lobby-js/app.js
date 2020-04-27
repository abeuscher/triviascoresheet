import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import LoginBar from './components/login-bar'
import GameRow from './components/game-row'
import DefaultGameState from '../common-js/default-game-state'

import ApiConnector from './components/api-connector'

/*

    

*/

class App extends Component {

    constructor(props) {
        super(props)
        this.checkLocalStorage()
        let saveState = this.getState()
        this.state = saveState ? saveState : this.defaultState
    }
    defaultState = {
        games: [],
        user: {}
    }
    defaultGameState = DefaultGameState("fromlobby")
    componentDidMount() {
        this.getUser()
        this.fetchGames()
    }
    fetchGames = () => {
        ApiConnector("read", "")
            .then(res => {
                if (res.error) {
                    this.showError("There was a problem getting the games. WTF? I'll go hit the monkey on the head with a newspaper. Sit tight.")
                }
                else {
                    this.state.games = res
                    this.setState(this.state)
                }
            })
    }
    saveState = () => {
        if (this.state.games.length) {
            console.log("Save to local storage")
            window.sessionStorage.setItem("lobbystate", JSON.stringify(this.state));
        }
    }
    getUser = () => {
        this.state.user = JSON.parse(window.sessionStorage.getItem("userstate"))
        this.setState(this.state)
    }
    getState = () => {
        if (window.sessionStorage.getItem("lobbystate") != undefined) {
            return JSON.parse(window.sessionStorage.getItem("adminstate"))
        }
        return false
    }
    checkLocalStorage = () => {
        if (window.sessionStorage.getItem("userstate") == undefined) {
            location.href = "login.html"
        }
    }
    joinGame = e => {
        ApiConnector("read", JSON.stringify({ id: e.target.getAttribute("data-id") }))
            .then(res => {
                let gameState = Object.assign({}, this.defaultGameState, { game: res })
                window.sessionStorage.setItem("gamestate", JSON.stringify(gameState));
                location.href = "/"
            })
    }
    logout = () => {
        window.sessionStorage.removeItem("userstate")
        window.sessionStorage.removeItem("adminstate")
        window.sessionStorage.removeItem("gamestate")
        this.state.user = {}
        this.setState(this.state)
        location.href = "login.html"
    }
    render() {

        return pug`
            #wrapper
                LoginBar(
                    user=this.state.user,
                    logout=this.logout
                )
                .lobby
                    h1 Welcome to the lobby
                    h2 Current Games:
                    for game,game_idx in this.state.games
                        GameRow(
                            key="game-row-"+game_idx
                            game=game,
                            joinGame=this.joinGame,
                            refresh=this.fetchGames
                            )
        `
    }
}
ReactDOM.render(<App />, document.getElementById('lobby-app'));