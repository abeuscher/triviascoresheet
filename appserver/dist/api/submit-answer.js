const cors = require("cors");

module.exports = (app, models, corsOptions) => {
    app.post("/submitanswer",
        cors(corsOptions),
        async (request, response) => {
            let thisGameModel = models["game"]

            try {
                await thisGameModel.findById(request.body.gameid).exec((err, result) => {
                    request.body.answer_sheet.answers.forEach((submittedAnswer, idx) => {
                        let compareAnswer = submittedAnswer.content.toLowerCase()
                        result.scoresheet.forEach(row => {
                            row.scored_sheets.forEach(sheet => {
                                sheet.answers.forEach(answer => {
                                    if (sheet.q == request.body.answer_sheet.q && answer.correct && answer.content.toLowerCase() == compareAnswer) {
                                        console.log("Answer match")
                                        request.body.answer_sheet.answers[idx].correct = true
                                    }
                                })
                            })
                        })
                    })
                    request.body.answer_sheet.status = "answer_basket"
                    result.answer_basket.push({ team: request.body.teamid, answer_sheet: request.body.answer_sheet })
                    result.save()
                    let thisRow = result.scoresheet.filter(row => {
                        return row.team._id == request.body.teamid
                    })
                    response.json({ msg: "success", data: thisRow })
                })
            }
            catch (e) {
                response.json({ error: "Error on answer submitted", msg: e })
                console.log("ERROR ON ANSWER SUBMIT:", e)
            }
        })
}
