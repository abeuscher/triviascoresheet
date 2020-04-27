import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import LoginForm from './components/login-form'
import SignupForm from './components/signup-form'
import RetrievePasswordForm from './components/retrieve-password-form'

import ApiConnector from './components/api-connector'

class App extends Component {

    constructor(props) {
        super(props)
        this.checkLocalStorage()
        this.state = {
            view:"login", // login, signup, changepw
            creds: {
                username:"",
                pasw:"",
                pasw2:""
            },
            error:""
        }
    }
    checkLocalStorage = () => {
        if (window.sessionStorage.getItem("userstate") != undefined) {
            location.href="lobby.html"
        }
    }

    logout = () => {
        window.sessionStorage.removeItem("userstate")
        window.sessionStorage.removeItem("userstate")
        window.sessionStorage.removeItem("adminstate")
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
        if (this.state.creds.username==""||this.state.creds.pasw=="") {
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
        setTimeout(flashError,15000)     
    }
    showMessage = msg => {
        const flashMessage = () => { 
            this.state.message=""
            this.setState(this.state)
        }
        this.state.message=msg
        this.setState(this.state)   
        setTimeout(flashMessage,5000)     
    }
    login = e => {
        e.preventDefault()
        if (this.checkForm) {
            ApiConnector("login",JSON.stringify(this.state.creds))
                .then(res=>{
                    console.log(res)
                    if (res.error) {
                        this.showError("You fail!")
                    }
                    else {
                        window.sessionStorage.setItem("userstate", JSON.stringify(res));
                        location.href="lobby.html"                        
                    }

                })
        }     
    }
    signup = e => {
        if (this.checkForm) {
            ApiConnector("signup",JSON.stringify(this.state.creds))
                .then(res=>{
                    if (res._id) {
                        window.sessionStorage.setItem("userstate", JSON.stringify(res));
                        location.href="lobby.html"     
                    }
                    else {
                        console.log(res)
                    }
                })
        }  
    }
    resetpw = e => {
        if (this.state.creds.pasw!=this.state.creds.pasw2 || this.state.creds.pasw=="" || this.state.creds.pasw2=="") {
            this.showError("Please make sure you entered two matching passwords. Blanks are not accepted. Because blank is not a password. It is the absence of a password.")
            return false;
        }  
    }
    render() {

        return pug`
            
            .login-bucket
                if this.state.view=="signup"
                    SignupForm(
                        creds=this.state.creds,
                        signup=this.signup,
                        changeView=this.changeView,
                        onChange=this.changeField
                        )
                else if this.state.view=="changepw"
                    RetrievePasswordForm(                        
                        creds=this.state.creds,
                        changeView=this.changeView,
                        onChange=this.changeField
                        )
                else
                    LoginForm(
                        creds=this.state.creds,
                        login=this.login,
                        changeView=this.changeView,
                        onChange=this.changeField
                        )                        
                .error-box
                    p=this.state.error
        `
    }
}
ReactDOM.render(<App />, document.getElementById('login-app'));