import React, { Component } from 'react'

export default class WaitingRoom extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            if this.props.waiting_room.length               
                .waiting-room.padded-column.section-title
                    h2="Waiting Room ("+this.props.waiting_room.length+" teams waiting)"
                for team,idx in this.props.waiting_room
                    .wr-row.flex(key="wr-row-"+idx)
                        .column.team-name.half(key="wr-team-"+idx)
                            p.team-name(key="wr-team-label"+idx)=team.team_name
                        .column.quarter
                            a.button.small(key="btn-add-team-"+idx,href="#",onClick=e=>{e.preventDefault();this.props.addTeamToSheet(team)}) Add Team to Scoresheet
                        .column.quarter
                            a.button.small(key="btn-delete-team-"+idx,href="#",onClick=e=>{e.preventDefault();this.props.deleteTeam(team)}) Delete Team
                         
        `
    }
}