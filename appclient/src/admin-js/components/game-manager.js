import React, { Component } from 'react'

export default class GameManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .manager-container.padded-column.section-title
                h2 Edit or Delete Games:
            .manager-container
                for game,idx in this.props.games
                    .manager-row.flex(key="m-row-"+idx)
                        .column.two-fifth
                            p.game-title=game.game_title
                        .column.fifth
                            a.button.small.edit(                                
                                href="#",
                                onClick = e => { e.preventDefault(); this.props.editGame(game) }
                                ) Edit Game Details
                        .column.fifth
                            a.button.small.play(
                                key="play-"+idx,
                                href="#",onClick = e => {e.preventDefault();this.props.playGame(game)}
                                ) Run Game
                        .column.fifth
                            a.button.small.delete(
                                key="delete"+idx,
                                onClick = e => {e.preventDefault(); this.props.deleteGame(game) }
                                ) Delete Game
        `
    }
}