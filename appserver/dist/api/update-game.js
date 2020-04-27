const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post('/updategame/', cors(corsOptions), async (request, response) => {
        try {
            let dbReq = await models["game"].findById(request.body._id).exec()
            dbReq.set(request.body)
            dbReq.save()
            response.send({msg:"success"})
        } catch (error) {
            console.log("Error on game update", error)
            response.send({error:"error on update. try again maybe?"})
        }

    });
}