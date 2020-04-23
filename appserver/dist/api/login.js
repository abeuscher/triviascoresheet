const cors = require("cors");
const bcrypt = require("bcrypt");

module.exports = (app, models, corsOptions) => {

    app.post('/login/', cors(corsOptions), async (request, response) => {
        let userResult = null
        let safeUser = null
        let userQuery = {
            username: request.body.username
        }
        try {
            userResult = await models["user"].findOne(userQuery).exec()
        }
        catch(e) {
            response.json({ error: "Query user error:", e})
        }
        try {
            safeUser = await models["user"].findById(userResult._id).select("-pasw")
        }
        catch(e) {
            response.json({ error: "Safe user error:", safeError })
        }
        bcrypt.compare(request.body.pasw, userResult.pasw)
            .then((match) => {
                response.json(match ? safeUser : { error: "Bad Login" })
            })

    })
}