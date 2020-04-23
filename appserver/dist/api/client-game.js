const cors = require("cors");

module.exports = (app, models, corsOptions) => {

    app.post('/clientgame/', cors(corsOptions), async (request, response) => {
        let thisGameModel = models["game"];
        if (request.body.id && request.body.userid) {
            try {
                let thisGame = await thisGameModel.findById(request.body.id)
                    .populate({ path: "waiting_room", populate: { path: "team" } })
                    .populate("scoresheet.team")
                    .exec()
                let output = { error: "no match" }
                thisGame.waiting_room.forEach(team => {
                    team.users.forEach(user => {
                        if (user._id == request.body.userid) {
                            output = {status:"waiting_room",data:team}
                        }
                    })
                })
                thisGame.scoresheet.forEach(row => {
                    row.team.users.forEach(user => {
                        if (user._id == request.body.userid) {
                            output = {status:"active",data:row.team}
                        }
                    })
                })
                response.send(output);
            } catch (e) {
                console.log("Error on get game plus team", e)
                response.json({ err: "Error on Get Game Plus Team", msg: e })
            }
        }
        else if (request.body.id) {
            try {
                let thisGame = await thisGameModel.findById(request.body.id)
                    .select("-scoresheet,-answer_basket,-waiting_room");
                response.send(thisGame ? thisGame : { error: "not found" });
            } catch (e) {
                console.log("Error on get game", e)
                response.json({ err: "Error on Get Game", msg: e })
            }
        }
        else if (request.body.game_code) {
            try {
                let thisGame = await thisGameModel.find(request.body)
                    .select("-scoresheet,-answer_basket,-waiting_room");
                response.send(thisGame ? thisGame : { error: "not found" });
            } catch (e) {
                console.log("Error on get game", e)
                response.json({ error: "Error on Get Game", msg: e })
            }
        }
        else {
            try {
                let thisGame = await thisGameModel.find()
                    .select("-scoresheet,-answer_basket,-waiting_room");
                response.send(thisGame ? thisGame : { error: "not found" });
            } catch (e) {
                console.log("Error on get game", e)
                response.json({ error: "Error on Get Game", msg: e })
            }
        }

    })
}