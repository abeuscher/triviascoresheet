const envSettings = require("../../env.js")()

module.exports=(action, data) => {

    let rootpath = envSettings.api;

    let paths = {
        login: rootpath + "login/",
        signup: rootpath + "signup/",
        changepw: rootpath + "changepw/"
    }

    return fetch(paths[action], Object.assign({}, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }, { body: data }))
        .then(res => res.json())
}