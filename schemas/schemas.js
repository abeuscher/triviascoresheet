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
        "answer": {
            team: {
                ref: "team",
                type: mongoose.Schema.Types.ObjectId
            },
            answer_text: {
                type: String,
                default: "BLANK"
            },
            bid_amount: {
                type: Number
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
            game_title: {
                type: String
            },
            game_description: {
                type: String
            },
            scores: [{
                team: {
                    type: String
                },
                answers: [{
                    q: {
                        type: Number
                    },
                    answer: [{
                        answer_text: {
                            type: String
                        },
                        correct: {
                            type: Boolean,
                            default: false
                        }
                    }],
                    bid: {
                        type: Number
                    },
                    created: {
                        type: Date,
                        default: Date.now
                    }
                }]
            }],
            answer_basket: [{
                team_name: {
                    type: String
                },
                q: {
                    type: Number
                },
                answer: [{
                    type: String
                }],
                bid: {
                    type: Number
                },
                correct: {
                    type: Boolean,
                    default: false
                },
                graded: {
                    type: Boolean,
                    default: false
                },
                created: {
                    type: Date,
                    default: Date.now
                }
            }],
            created: {
                type: Date,
                default: Date.now
            }
        }
    }
}

module.exports = AppSchemas;
