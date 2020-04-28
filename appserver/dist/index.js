const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const ChangePassword = require("./api/change-password")
const SubmitAnswer = require("./api/submit-answer")
const AddTeam = require("./api/add-team")
const GetGame = require("./api/get-game")
const ClientGame = require("./api/client-game")
const Create = require("./api/create")
const Get = require("./api/get")
const Delete = require("./api/delete")
const Login = require("./api/login")
const Signup = require("./api/signup")
const Update = require("./api/update")
const UpdateGame = require("./api/update-game")
const io = require("./api/io")


const CONNECTION_URL = "mongodb://mongodb/local";
const DataTypes = require("../schemas/schemas.js")();

const app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let corsOptions = {
    credentials: true,
    origin: 'http://64.225.118.246',
    optionsSuccessStatus: 200
}

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });

let server = app.listen(5000, () => {

    const schemas = [];
    const models = [];

    Object.keys(DataTypes).map(key => {
        schemas[key] = new mongoose.Schema(DataTypes[key]);
        models[key] = mongoose.model(key, schemas[key]);
    });

    app.get('/', cors(corsOptions), async (request, response) => {
        response.send("ok dokey fenokey");
    })

    AddTeam(app, models, corsOptions)
    SubmitAnswer(app, models, corsOptions)
    GetGame(app, models, corsOptions)
    ClientGame(app, models, corsOptions)
    Login(app, models, corsOptions)
    Signup(app, models, corsOptions)
    ChangePassword(app, models, corsOptions)
    Update(app, models, corsOptions)
    Delete(app, models, corsOptions)
    UpdateGame(app, models, corsOptions)
    Create(app, models, corsOptions)
    Get(app, models, corsOptions)

});
io(server)
