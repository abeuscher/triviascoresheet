import React, { Component } from 'react'

export default class UserManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .manager-container.padded-column.section-title
                h2 Edit or Delete Users:
            .manager-container.padded-column  
                if this.props.users.length>0
                    for user,idx in this.props.users
                        .manager-row.flex(key="m-row-"+idx)
                            .column.two-fifth
                                p.username=user.username
                            .column.two-fifth
                                label admin?
                                    input(type="checkbox",name="admin",checked=user.admin,onChange=this.props.changeUserPrivileges,data-idx=idx)
                                label host?
                                    input(type="checkbox",name="host",checked=user.host,onChange=this.props.changeUserPrivileges,data-idx=idx)
                                label player?
                                    input(type="checkbox",name="player",checked=user.player,onChange=this.props.changeUserPrivileges,data-idx=idx)
                            .column.fifth
                                a.button.small.delete(
                                    key="delete"+idx,
                                    onClick = e => {e.preventDefault(); this.props.deleteUser(user) }
                                    ) Delete
        `
    }
}