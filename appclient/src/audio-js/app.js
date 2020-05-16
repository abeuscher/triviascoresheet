import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Peer from 'peerjs-client'

import Env from '../env'


class AudioApp extends Component {

    constructor(props) {
        super(props);

    }
    peer = () => {

        const peer = new Peer('someid', {
            host: 'localhost',
            port: 5000,
            path: '/peerjs/myapp'
          })
        console.log("peer triggered")
        peer.on("open", data=>{
            console.log("connect:",data, peer.options.token)
        })
        peer.on("data", data=>{
            console.log("received data:",data)
        })

    }
    componentDidMount() {
        this.peer()
        
    }
    render() {
        return pug`
            #wrapper
                h2 Audio app.
                button#play-button Call
                audio(controls)
        `
    }
}
ReactDOM.render(<AudioApp />, document.getElementById('audio-app'));