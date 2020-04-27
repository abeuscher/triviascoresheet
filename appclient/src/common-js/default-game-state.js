module.exports = origin => {
    return {
        mode: origin,
        error: "",
        team: {
            team_name: "",
            answer_history: []
        },
        game: null,
        current_answer_sheet: null,
        current_bid: 1,
        bids: [1, 3, 5, 7],
        joined_game_chat:false,
        io: {
            gamestatus: {
                label: "Game Status",
                messages: [{
                    className: "intro",
                    msg: "Welcome to the Game! This is the game status window and will tell you what is currently happening in the game.",
                    data: null,
                    status:"unread"
                }]
            },
            hostchat: {
                label: "Host Chat",
                current_message: "",
                messages: [{
                    className: "intro",
                    msg: "This is the host chat window. Check here for messages from the game host.",
                    data: null,
                    status:"unread"
                }]
            },
            gamechat: {
                label: "Game Chat",
                current_message: "",
                messages: [{
                    className: "intro",
                    msg: "This is the game chat. Messages here are visible to all players in the game.",
                    data: null,
                    status:"unread"
                }]
            }
        }
    }
}