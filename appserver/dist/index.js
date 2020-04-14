const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage }).array('file')

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

mongoose.connect(CONNECTION_URL,{ useNewUrlParser: true });

app.listen(5000, () => {
    const schemas = [];
    const models = [];
    Object.keys(DataTypes).map(key => {
        schemas[key] = new mongoose.Schema(DataTypes[key]);
        models[key] = mongoose.model(key, schemas[key]);
    });
    app.use("/uploads", Express.static('uploads'));

    app.post('/get/:type', cors(corsOptions), async (request, response) => {

        let Entry = models[request.params.type];
        if (request.body.id) {
            try {
                var result = await Entry.findById(request.body.id).exec();
                response.send(result ? result : {error:"not found"});
            } catch (error) {
                response.status(500).send(error);
            }            
        }
        else {
            try {
                var result = await Entry.find().exec();
                response.send(result ? result : {error:"not found"});
            } catch (error) {
                response.status(500).send(error);
            }   
        }



    });

    app.post('/update/:type', cors(corsOptions), async (request, response) => {

        let Entry = models[request.params.type];

        try {
            let dbReq = await Entry.findById(request.body.id).exec();        
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
    app.post('/create/:type', (request, response) => {

        if (request.params.type == "image") {
            upload(request, response, function (err) {
                if (err instanceof multer.MulterError) {
                    return response.status(500).json(err)
                } else if (err) {
                    return response.status(500).json(err)
                }
                return response.status(200).send(request.files)
            });
        }
        else {
            let newData = new models[request.params.type](request.body);
            //response.send(models[request.params.type]);

            newData.save(function (err, data) {
                if (err) {
                    response.send(err);
                }
                else {
                    response.json(data);
                }

            });

        }
    });
});
function fixSchemas(schema) {
    var output = {};
    Object.keys(schema).map(key => {
        if (typeof schema[key]=='object') {
            output[key]=fixSchemas(schema[key]);
        }
        else {
            output[key] == schema[key] == "_id" ? mongoose.Schema.Types.ObjectId : schema[key]
        }
    })
    return output;
}