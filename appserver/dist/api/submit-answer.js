const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post("/submitanswer",
        cors(corsOptions),
        async (request, response) => {
            let thisGameModel = models["game"]

            try {
                let thisGame = await thisGameModel.findById(request.body.gameid).exec()
                request.body.answer_sheet.status = "answer_basket"
                thisGame.answer_basket.push({ team: request.body.teamid, answer_sheet: request.body.answer_sheet })
                thisGame.save()
                let thisRow = thisGame.scoresheet.filter(row => {
                    return row.team._id == request.body.teamid
                })
                response.json({ msg: "success", data: thisRow })
            }
            catch (e) {
                response.json({ res: "Error on answer submitted", msg: e })
                console.log("ERROR ON ANSWER SUBMIT:", e)
            }
        })
}
