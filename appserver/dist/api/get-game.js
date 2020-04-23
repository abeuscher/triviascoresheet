const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post("/getgame/", cors(corsOptions), async (request, response) => {
        let thisGameModel = models["game"];

        if (request.body.id) {
            try {
                let thisGame = await thisGameModel.findById(request.body.id)
                    .populate({ path: "waiting_room", populate: { path: "team" } })
                    .populate("answer_basket.team")
                    .populate("scoresheet.team")
                    .exec();
                response.send(thisGame ? thisGame : { error: "not found" });
            } catch (e) {
                console.log("Error on get game", e)
                response.json({ err: "Error on Get Game", msg: e })
            }
        }
        else {
            try {
                let result = await thisGameModel.find()
                    .populate({ path: "waiting_room", populate: { path: "team" } })
                    .populate("answer_basket.team")
                    .populate("scoresheet.team")
                    .exec();
                response.json(result)
            }
            catch (e) {
                console.log("Error on deep read", e)
                response.json({ err: "Error on Deep Read", msg: e })
            }
        }


    })
}