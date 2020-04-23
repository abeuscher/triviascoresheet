const cors = require("cors");
const bcrypt = require("bcrypt");

module.exports = (app, models, corsOptions) => {

    app.post('/signup/', cors(corsOptions), (request, response) => {

        bcrypt.hash(request.body.pasw, 10, (err, hash) => {
            if (err) {
                response.json({ error: err })
            }
            let userQuery = {
                username: request.body.username,
                pasw: hash
            }
            let newUser = new models["user"](userQuery)
            newUser.save(function (err) {
                if (err) {
                    response.send({ error: true })
                }
                else {
                    models["user"].findOne({ username: request.body.username })
                        .select("-pasw")
                        .then((user, errr) => {
                            if (errr) {
                                response.json({ error: errr })
                            }
                            else {
                                response.json(user)
                            }
                        })

                }
            });
        })
    })
}