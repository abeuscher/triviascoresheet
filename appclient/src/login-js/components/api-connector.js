function apiConnector(action, data, type) {

    let rootpath = "http://localhost:5000/";
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

module.exports=apiConnector