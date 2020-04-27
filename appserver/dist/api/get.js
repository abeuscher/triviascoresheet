const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post("/get/:type", cors(corsOptions), async (request, response) => {
        let thisModel = models[request.params.type];
        if (request.body.id) {
            try {
                let result = await thisModel.findById(request.body.id).exec();
                response.send(result ? result : { error: "not found" });
            } catch (e) {
                console.log("Error on get game", e)
                response.json({ err: "Error on Get", msg: e })
            }
        }
        else {
            try {
                let result = await thisModel.find().exec();
                response.json(result)
            }
            catch (e) {
                console.log("Error on get all " + request.params.type, e)
                response.json({ err: "Error on Get All", msg: e })
            }
        }


    })
}