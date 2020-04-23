const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post('/update/:type', cors(corsOptions), async (request, response) => {
        try {
            let dbReq = await models[request.params.type].findById(request.body._id).exec();
            dbReq.set(request.body);
            let result = await dbReq.save();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }

    });
}