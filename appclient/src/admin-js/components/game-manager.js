import React, { Component } from 'react'

export default class GameManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .manager-container
                h3 Edit or Delete Games:
                for game,idx in this.props.games
                    .manager-row(key="m-row-"+idx)
                        a(key="record"+idx,href="#",onClick = () => { this.props.editGame(game) })=game.game_title + " starts on " + game.start_time 
                        a.delete(key="delete"+idx,onClick = () => { this.props.deleteGame(game) }) Delete this record
        `
    }
}