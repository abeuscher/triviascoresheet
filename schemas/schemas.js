const mongoose = require('mongoose');

/*
    Adding a field to the schema will add it throughout the app. A restart of the client and server is required.
    IT may be that I can remove this weird outer dependency on Mongoose, but after several tries to fix it while entering schema -> server I have given up for now.

    Dependency:
        New data types MUST have:
            title: {
                type: String,
                dafault: "State Your Name"
            },
            created: {
                type: Date,
                default: Date.now
            }

*/

function AppSchemas() {
    return {
        "answer_sheet": {
            game: {
                ref: "game",
                type: mongoose.Schema.Types.ObjectId
            },
            team: {
                ref: "team",
                type: mongoose.Schema.Types.ObjectId
            },
            q: {
                type: Number
            },
            graded: {
                type: Boolean,
                default: false
            },
            answers: [{
                content: {
                    type: String,
                    default: "BLANK"
                },
                bid: {
                    type: Number
                },
                correct: {
                    type: Boolean,
                    default: false
                }
            }],
            created: {
                type: Date,
                default: Date.now
            }
        },
        "team": {
            team_name: {
                type: String
            },
            created: {
                type: Date,
                default: Date.now
            }
        },
        "game": {
            start_time: {
                type: Date,
                default: Date.now
            },
            num_questions: {
                type: Number,
                min: 1,
                max: 20,
                default: 20
            },
            current_question: {
                type: Number,
                min: 0,
                max: 20,
                default: 0
            },
            game_code: {
                type: String,
                unique: true
            },
            game_over: {
                type: Boolean,
                default: false
            },
            game_title: {
                type: String
            },
            game_description: {
                type: String
            },
            waiting_room: [{
                ref: "team",
                type: mongoose.Schema.Types.ObjectId
            }],
            scoresheet: [{
                team: {
                    ref: "team",
                    type: mongoose.Schema.Types.ObjectId
                },
                answer_sheets: [{
                    ref: "answer_sheet",
                    type: mongoose.Schema.Types.ObjectId
                }]
            }],
            answer_basket: [{
                ref: "answer_sheet",
                type: mongoose.Schema.Types.ObjectId
            }],
            created: {
                type: Date,
                default: Date.now
            }
        }
    }
}

module.exports = AppSchemas;
