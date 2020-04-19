function apiConnector(action, data, type) {

    let rootpath = "http://teamtrivia.localapi:5000/";
    let paths = {
        create: rootpath + "create/" + type,
        read: rootpath + "get/" + type,
        update: rootpath + "update/" + type,
        delete: rootpath + "delete/" + type,
        scoreanswer: rootpath + "scoreanswer/"
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