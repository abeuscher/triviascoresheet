const mongoose = require('mongoose');

function AppSchemas() {
    return {
        "user": {
            username: {
                type: String,
                unique: true,
                lowercase: true
            },
            pasw: {
                type: String
            },
            display_name: {
                type: String
            },
            admin: {
                type: Boolean,
                default: false
            },
            host: {
                type: Boolean,
                default: false
            },
            player: {
                type: Boolean,
                default: true
            }
        },
        "team": {
            team_name: {
                type: String
            },
            users: [{
                ref: "user",
                type: mongoose.Schema.Types.ObjectId
            }],
            answer_history: [{
                q: {
                    type: Number
                }, bid: {
                    type: Number
                }
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
                default: "not started"
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
                    score: {
                        type:Number,
                        default:0
                    },
                    answers: [{
                        content: {
                            type: String
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
                    score: {
                        type:Number,
                        default:0
                    },
                    answers: [{
                        content: {
                            type: String
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
