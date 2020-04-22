import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import LoginForm from './components/login-form'
import SignupForm from './components/signup-form'
import RetrievePasswordForm from './components/retrieve-password-form'


import ApiConnector from './components/api-connector'

import io from 'socket.io-client'

/*

    

*/

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            view:"login", // login, signup, getpw
            creds: {
                username:"",
                pas:"",
                pas2:""
            },
            error:""
        }
    }
    changeView = view => {
        this.state.view = view
        this.setState(this.state)
    }
    changeField = e => {
        this.state.creds[e.target.name]=e.target.value
        this.setState(this.state)
    }
    checkForm = () => {
        if (this.state.creds.username==""||this.state.creds.pas=="") {
            this.showError("Please enter both username and password to continue. If you don't mind. Is this your first time logging in to something?")
            return false;
        }        
        return true;
    }
    showError = msg => {
        const flashError = () => { 
            this.state.error=""
            this.setState(this.state)
        }
        this.state.error=msg
        this.setState(this.state)   
        setTimeout(flashError,5000)     
    }
    login = e => {
        if (this.checkForm) {
            ApiConnector("login",JSON.stringify(this.state.creds))
                .then(res=>{
                    console.log(res)
                })
        }     
    }
    signup = e => {
        if (this.checkForm) {
            ApiConnector("signup",JSON.stringify(this.state.creds))
                .then(res=>{
                    console.log(res)
                })
        }  
    }
    resetpw = e => {
        if (this.state.creds.pas!=this.state.creds.pas2 || this.state.creds.pas=="" || this.state.creds.pas2=="") {
            this.showError("Please make sure you entered two matching passwords. Blanks are not accepted. Because blank is not a password. It is the absence of a password.")
            return false;
        }  
    }
    render() {

        return pug`
            .login-bucket
                if this.state.view=="login"
                    LoginForm(creds=this.state.creds)
                else if this.state.view=="signup"

                else if this.state.view=="getpw"
                .error-box
                    p=this.state.error
        `
    }
}
ReactDOM.render(<App />, document.getElementById('login-app'));