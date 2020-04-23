const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post('/changepassword/', cors(corsOptions), async (request, response) => {
        try {
            let dbReq = await models["user"].findById(request.body._id).exec();
            dbReq.set(request.body);
            let result = await dbReq.save();
            response.send(result);
        } catch (error) {
            response.json({ error: "Error updating record" })
        }
    })
}