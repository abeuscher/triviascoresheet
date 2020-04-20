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
    credentials: true,
    origin: 'http://teamtrivia.local',
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
    app.post("/submitanswer", cors(corsOptions), async (request, response) => {
        let thisAnswer = models["answer_sheet"](request.body)
        let thisGameModel = models["game"]

        thisAnswer.save()
        try {
            let thisGame = await thisGameModel.findById(request.body.game).exec()
            thisGame.answer_basket.push(thisAnswer)
            thisGame.save()
            response.json(thisAnswer)
        }
        catch(e) {
            response.json({ res: "Error on answer submitd", msg: e })
            console.log("ERROR ON ANSWER SUBMIT:", e)            
        }
    })
    app.post("/scoreanswer", cors(corsOptions), async (request, response) => {
        let Entry = models["game"];
        console.log("answer scored", request.body.id)
        try {


            let thisGame = await Entry.findById(request.body.id).exec()
            // Delete From Answer Basket
            let answer = request.body.answer;
            let basket = thisGame.answer_basket.filter(item => {
                return item._id != answer._id
            })
            thisGame.answer_basket = basket;


            //Find Score and add this answer to it.
            for (t in thisGame.teams) {
                if (thisGame.teams[t].team == request.body.answer.team_name) {
                    let now = new Date()
                    console.log("Push answer to scoresheet", answer, now.toString())
                    delete answer.team_name;
                    thisGame.teams[t].answers.push(answer)
                }
                else {
                    console.log("No match", thisGame.teams[t].team, request.body.answer.team_name)
                }
            }


            //Remove this from answer 
            thisGame.save();
            response.json({ msg: "Answer submitted." })
        }
        catch (e) {
            response.json({ res: "Error on answer submitd", msg: e })
            console.log("ERROR ON ANSWER SUBMIT:", e)
        }

    })
    app.post('/addteam/', cors(corsOptions), async (request, response) => {
        let gameModel = models["game"];
        let thisTeam = models["team"](request.body.team);
        thisTeam.save()  
        try {
            let thisGame = await gameModel.findById(request.body._id).exec()
            thisGame.waiting_room.push(thisTeam)
            thisGame.save()
            response.json(thisTeam)
        }
        catch (e) {
            console.log({ err: "Error on enter waiting room", msg: e })
            response.json({ err: "Error on enter waiting room", msg: e })
        }
    })
    app.post("/getgame/", cors(corsOptions), async (request, response) => {
        let thisGameModel = models["game"];

        if (request.body.id) {
            try {
                let thisGame = await thisGameModel.findById(request.body.id)
                    .populate({path:"waiting_room", populate: { path: "team"}})
                    .populate("answer_basket")
                    .populate("scoresheet.team")
                    .populate("scoresheet.answer_sheets")
                    .exec();
                response.send(thisGame ? thisGame : { error: "not found" });
            } catch (e) {
                console.log("Error on get game",e)
                response.json({ err: "Error on Get Game", msg: e })
            }
        }
        else {
            try {
                let result = await thisGameModel.find()
                    .populate({path:"waiting_room", populate: { path: "team"}})
                    .populate("answer_basket")
                    .populate("scoresheet.team")
                    .populate("scoresheet.answer_sheets")
                    .exec();
                response.json(result)
            }
            catch(e) {
                console.log("Error on deep read",e)
                response.json({ err: "Error on Deep Read", msg: e })
            }           
        }

        
    })
    app.post('/get/:type', cors(corsOptions), async (request, response) => {

        let Entry = models[request.params.type];
        if (request.body.id) {
            try {
                let result = await Entry.findById(request.body.id).populate().exec();
                response.send(result ? result : { error: "not found" });
            } catch (error) {
                response.status(500).send(error);
            }
        }
        else {
            try {
                let result = await Entry.find().populate().exec();
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
    app.post('/creategame/', (request, response) => {
        let newData = new models["game"](request.body);

        newData.save(function (err, data) {
            if (err) {
                response.send(err)
            }
            else {
                console.log("Record ID:", data._id)
                response.json(data)
            }
        });

    });
    app.post('/create/:type', (request, response) => {
        let newData = new models[request.params.type](request.body);
        newData.save(function (err, data) {
            if (err) {
                response.send(err)
            }
            else {
                console.log("Record ID:", data._id)
                response.json(data)
            }
        });
    });

});
const io = require('socket.io')(server, {
    credentials: true,
    origin: 'http://teamtrivia.local',
    cookie: false
});
let host = null;
io.on('connection', (socket) => {
    socket.emit("welcome", "Hey there");
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.on("host message", (msg) => {
        console.log('message: ' + msg);
    });
    socket.on("clientmsg", msg => {
        if (host) {
            host.emit("clientmsg", msg)
        }
    })
    socket.on("identify host", msg => {
        host = socket;
        host.on("gamecontrol", (msg) => {
            io.emit("gamecontrol", msg);
        });
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});