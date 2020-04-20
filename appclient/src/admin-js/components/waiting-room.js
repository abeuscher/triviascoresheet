import React, { Component } from 'react'

export default class WaitingRoom extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
        .waiting-room.padded-column.flex
            if !this.props.waiting_room.length               
                .header
                    h2 Waiting Room Empty
            else
                for team,idx in this.props.waiting_room
                    .wr-row.flex(key="wr-row-"+idx)
                        .column.team-name(key="wr-team-"+idx)
                            p(key="wr-team-label"+idx)=team.team_name
                        .column.controls
                            a(key="btn-add-team-"+idx,onClick=()=>{this.props.addTeamToSheet(team)}) Add Team to Scoresheet
                            a(key="btn-delete-team-"+idx,onClick=()=>{this.props.deleteTeam(team)}) Delete Team
                         
        `
    }
}