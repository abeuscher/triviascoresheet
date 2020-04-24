const envSettings = require("../../env.js")()

module.exports=(action, data, type) => {

    let rootpath = envSettings.api;
    let paths = {
        read: rootpath + "clientgame/",
        update: rootpath + "update/" + type
    }

    //console.log("API Call: " + paths[action], data, type)

    return fetch(paths[action], Object.assign({}, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }, { body: data }))
        .then(res => res.json())
}