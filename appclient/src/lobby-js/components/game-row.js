import React, { Component } from 'react'

export default class GameRow extends Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return pug`
            if (this.props.header)
                .game-row.header.flex
                    .column.two-fifth
                        p.title Title
                    .column.fifth
                        p.status Status
                    .column.fifth
                        p.time Time
                    .column.fifth
                        p.join Join Game
            else
                .game-row.flex
                    .column.two-fifth
                        p.title=this.props.game.game_title
                    .column.fifth
                        p.status=this.props.game.game_status
                    .column.fifth
                        p.time=this.props.game.start_time
                    .column.fifth
                        a.button(href="#",onClick=this.props.joinGame,data-id=this.props.game._id) Join Game
        `
    }
}
