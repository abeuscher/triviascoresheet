import React, { Component } from 'react'

export default class GameManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.games)
        return pug`
            .manager-container.padded-column.section-title
                h2 Edit or Delete Games:
            .manager-container.padded-column  
                for game,idx in this.props.games
                    .manager-row.flex(key="m-row-"+idx)
                        .column.two-fifth
                            p.game-title=game.game_title
                            p.start-time=game.start_time 
                        .column.fifth
                            a.button.small.edit(                                
                                href="#",
                                onClick = e => { e.preventDefault(); this.props.editGame(game) }
                                ) Edit Game
                        .column.fifth
                            a.button.small.play(
                                key="play-"+idx,
                                href="#",onClick = e => {e.preventDefault();this.props.playGame(game)}
                                ) Play Game
                        .column.fifth
                            a.button.small.delete(
                                key="delete"+idx,
                                onClick = e => {e.preventDefault(); this.props.deleteGame(game) }
                                ) Delete this record
        `
    }
}