import React, { Component } from 'react'

export default class GameManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            h3 Edit or Delete Games:
            .manager-container
                for game,idx in this.props.games
                    .manager-row
                        a(key="record"+idx,href="#",onClick = () => { this.props.editGame(game) })=game.game_title + " starts on " + game.start_time 
                        a.delete(key="delete"+idx,onClick = () => { this.props.deleteGame(game) }) Delete this record
        `
    }
}