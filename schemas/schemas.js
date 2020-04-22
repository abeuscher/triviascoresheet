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
        "user":{
            username:{
                type:String,
                unique:true,
                lowercase:true
            },
            pasw:{
                type:String
            },
            display_name:{
                type:String
            },
            privileges:[{
                "admin": {
                    type:Boolean,
                    default:false
                },
                "host": {
                    type:Boolean,
                    default:false
                },
                "player":{
                    type:Boolean,
                    default:true
                }
            }]
        },
        "team": {
            team_name: {
                type: String
            },
            users:[{
                ref:"user",
                type: mongoose.Schema.Types.ObjectId
            }],
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
            game_status: {
                type: String,
                default: "new"
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
                scored_sheets: [{
                    q: {
                        type: Number
                    },
                    status: {
                        type: String,
                        default: "unsubmitted"
                    },
                    answers: [{
                        content: {
                            type: String
                        },
                        bid: {
                            type: Number
                        },
                        scored: {
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
                }]
            }],
            answer_basket: [{
                team: {
                    ref: "team",
                    type: mongoose.Schema.Types.ObjectId
                },
                answer_sheet: {
                    q: {
                        type: Number
                    },
                    status: {
                        type: String,
                        default: "unsubmitted"
                    },
                    answers: [{
                        content: {
                            type: String
                        },
                        bid: {
                            type: Number
                        },
                        scored: {
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
