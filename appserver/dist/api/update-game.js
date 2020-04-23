const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post('/updategame/', cors(corsOptions), async (request, response) => {
        try {
            let dbReq = await models["game"].findById(request.body._id)
                .populate({ path: "waiting_room", populate: { path: "team" } })
                .populate("answer_basket.team")
                .populate("scoresheet.team")
                .exec();
            dbReq.set(request.body);
            let result = await dbReq.save();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }

    });
}