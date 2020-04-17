import React, { Component } from 'react'

export default class CodeManager extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return pug`
            .code-container
                h3 Game Access Codes and Links:
                .code-list
                    for code,idx in this.props.game_codes
                        .game-code(key="code-bucket-"+idx)    
                            input(disabled,key="code-"+idx,name="code-"+idx,value=code.token,onClick=this.props.editCode,onChange=this.props.changeCode)
                            button.delete(key="delete-code-"+idx,onClick=this.props.deleteCode(code))
                label(for="new_code") Add New:
                    input(key="new_code",name="new_code",type="text",onChange=this.props.changeCode,value=this.props.new_code)
                button(onClick=this.props.addCode) Add Code
        `
    }
}