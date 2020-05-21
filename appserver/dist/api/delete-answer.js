const cors = require("cors");

module.exports = (app, models, corsOptions) => {

    app.post('/deleteanswer/', cors(corsOptions), async (request, response) => {
        try {
            let thisTeam = await models["team"].findById(request.body.team._id).exec()
            thisTeam.answer_history = thisTeam.answer_history.filter(sheet=>{
                return sheet.q!=request.body.answer_sheet.q
            })
            thisTeam.save()           
            response.json({msg:thisTeam})
        }
        catch (e) {
            console.log({ err: "Error on Team History Update", msg: e })
            response.json({ err: "Error on Team History Update", msg: e })
        }
    })

}