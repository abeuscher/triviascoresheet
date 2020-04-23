const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post('/create/:type', cors(corsOptions), (request, response) => {
        let newData = new models[request.params.type](request.body);
        newData.save(function (err, data) {
            if (err) {
                response.send(err)
            }
            else {
                console.log("Record ID:", data._id)
                response.json(data)
            }
        })
    })
}