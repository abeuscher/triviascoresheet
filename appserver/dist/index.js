const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


const CONNECTION_URL = "mongodb://mongodb/local";
const DataTypes = require("../schemas/schemas.js")();


const app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let corsOptions = {
    origin: 'http://teamtrivia.local',
    optionsSuccessStatus: 200
}

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });

app.listen(5000, () => {
    const schemas = [];
    const models = [];


    Object.keys(DataTypes).map(key => {
        console.log(key);
        schemas[key] = new mongoose.Schema(DataTypes[key]);
        models[key] = mongoose.model(key, schemas[key]);
    });

    app.get('/', cors(corsOptions), async (request, response) => {
        response.send("ok dokey fenokey");
    })

    app.post('/get/:type', cors(corsOptions), async (request, response) => {

        let Entry = models[request.params.type];
        if (request.body.id) {
            try {
                var result = await Entry.findById(request.body.id).exec();
                response.send(result ? result : { error: "not found" });
            } catch (error) {
                response.status(500).send(error);
            }
        }
        else {
            try {
                var result = await Entry.find().exec();
                response.send(result ? result : { error: "not found" });
            } catch (error) {
                response.status(500).send(error);
            }
        }

    });

    app.post('/update/:type', cors(corsOptions), async (request, response) => {

        let Entry = models[request.params.type];

        try {
            let dbReq = await Entry.findById(request.body._id).exec();
            dbReq.set(request.body);
            let result = await dbReq.save();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }

    });

    app.post("/delete/:type", async (request, response) => {
        let Entry = models[request.params.type];
        try {
            var result = await Entry.deleteOne({ _id: request.body.id }).exec();
            response.send(result);
        } catch (error) {
            response.status(500).send(error);
        }
    });

    app.post('/create/:type',(request, response) => {
            let newData = new models[request.params.type](request.body);
            newData.save(function (err, data) {
                if (err) {
                    response.send(err)
                }
                else {
                    console.log("Record ID:",data._id)
                    response.json(data)
                }
            });          
    });

});