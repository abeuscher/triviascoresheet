const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post("/delete/:type", cors(corsOptions), async (request, response) => {
        try {
            await models[request.params.type].deleteOne({ _id: request.body._id }).exec();
            response.send({ deleted: true });
        } catch (error) {
            response.status(500).send(error);
        }
    })
}