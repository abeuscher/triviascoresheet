const cors = require("cors");
const bcrypt = require("bcrypt");

module.exports = (app, models, corsOptions) => {
    app.post('/changepw/', cors(corsOptions), async (request, response) => {
        let dbReq = null;
        try {
            dbReq = await models["user"].findOne({ username: request.body.username }).exec()
            bcrypt.hash(request.body.pasw, 10, (err, hash) => {
                if (err) {
                    response.json({ error: "Error Generating Hash" })
                }
                dbReq.set({ pasw: hash })
                dbReq.save()
            })
        } catch (error) {
            response.json({ error: "Error updating record" })
        }
        try {
            safeUser = await models["user"].findById(dbReq._id).select("-pasw")
            response.json(safeUser)
        }
        catch(e) {
            response.json({ error: "Safe user error:", safeError })
        }
    })
}
