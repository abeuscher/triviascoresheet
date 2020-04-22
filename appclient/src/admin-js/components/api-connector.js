function apiConnector(action, data, type) {

    let rootpath = "http://teamtrivia.localapi:5000/";
    let paths = {
        createGame: rootpath + "creategame/",
        getGame: rootpath + "getgame/",
        create: rootpath + "create/" + type,
        get: rootpath + "game/" + type,
        update: rootpath + "update/" + type,
        updateGame: rootpath + "updategame/",
        delete: rootpath + "delete/" + type
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

module.exports=apiConnector