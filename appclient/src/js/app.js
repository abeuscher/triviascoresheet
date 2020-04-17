import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import IntroForm from './components/intro-form'
import Timer from './components/timer'

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
        this.state = {
            mode:"fresh", //fresh, before, happening, over
            teamName: "BLANK",
            gameid: null,
            game_title: "",
            start_time:null,
            score:{
                current_round:{
                    round_number:0,
                    categories:[],
                    bids:[]
                },
                past_rounds:[]
            },
            currentQuestion: 0,
            gameDetails: {}
        };
        this.handleIntroFormChange = this.handleIntroFormChange.bind(this);
    }
    componentDidMount() {
        let gameid = this.getUrlParameter("pqid")
        if (!gameid) {
            this.state.error = "No game specified. Bad URL";
            this.setState(this.state)
        }
        else {
            ApiConnector("read", JSON.stringify({ game_code: gameid }), "game")
                .then(res => {
                    if (res.length == 1) {
                        this.state.gameid = res[0]._id
                        this.state.game_title = res[0].game_title
                        this.state.start_time = res[0].start_time
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

    startWait = () => {
        
        this.state.mode="before"

        this.setState(this.state)
    }

    handleIntroFormChange = e => {
        let newValue = e.target.value
        let name = e.target.name
        this.state[name] = newValue
        this.setState(this.state);
    }
    handleIntroFormSubmit = e => {
        ApiConnector("addTeam",JSON.stringify({id:this.state.gameid,team_name:this.state.teamName}))
            .then(res => {
                console.log(res)
                if (res.game) {
                    var now = new Date()
                    if (res.game.start_time<now) {
                        this.state.error="The game has passed. It is too late. Give up now."
                    }
                    else {
                        this.state.start_time=res.game.start_time
                        this.startWait();
                    }
                }
                
            })
    }
    render() {

        return pug`
            if this.state.mode=="fresh"
                IntroForm(
                    teamName=this.state.teamName,
                    gameID=this.state.gameID,
                    game_title=this.state.game_title,
                    onChange=this.handleIntroFormChange,
                    onSubmit=this.handleIntroFormSubmit
                    )
            if this.state.mode=="before"
                Timer(start_time=this.state.start_time)
            
        `
    }
}
ReactDOM.render(<App />, document.getElementById('player-app'));