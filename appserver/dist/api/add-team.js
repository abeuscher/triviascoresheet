const cors = require("cors");

module.exports = (app, models, corsOptions) => {

    app.post('/addteam/', cors(corsOptions), async (request, response) => {
        try {
            let thisGame = await models["game"].findById(request.body._id).exec()
            let thisTeam = models["team"](request.body.team);
            thisTeam.save();            
            thisGame.waiting_room.push(thisTeam)
            thisGame.save()
            response.json(thisTeam)
        }
        catch (e) {
            console.log({ err: "Error on enter waiting room", msg: e })
            response.json({ err: "Error on enter waiting room", msg: e })
        }
    })

}