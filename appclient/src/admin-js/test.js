gameTemplate = {
    "name": "",
    questions: [{
        "question": "What is air?",
        "answers": ["oxygen", "hydrogen"],
        type: "bid1357"
    }, {
        "question": "What is air?",
        "answers": ["oxygen", "hydrogen"],
        type: "bid1357"
    }, {
        "question": "What is air?",
        "answers": ["oxygen", "hydrogen"],
        type: "bid1357"
    }, {
        "question": "What is air?",
        "answers": ["oxygen", "hydrogen"],
        type: "bid1357"
    }, {
        "question": "What is air?",
        "answers": ["oxygen", "hydrogen"],
        type: "4part2point"
    }]
}
answerTypes = {
    "bid1357": {
        "answers": 1,
        "label": "Single Answer - Bid 1,3,5,7",
        "instructions": "Bid 1,3,5, or 7. You may bid each point value only once.",
        "score": (answers) => { return answers[0].correct ? answers[0].bid : 0; }
    },
    "bid2468": {
        "answers": 1,
        "label": "Single Answer - Bid 2,4,6,8",
        "instructions": "Bid 2,4,6, or 8. You may bid each point value only once.",
        "score": (answers) => { return answers[0].correct ? answers[0].bid : 0; }
    },
    "bid1357_2part": {
        "answers": 2,
        "label": "Two Answers - Bid 1,3,5,7",
        "instructions": "Bid 1,3,5, or 7. You may bid each point value only once. Each correct answer is equal to half of your bid.",
        "score": (answers) => {
            let calcScore = 0;
            answers.forEach(answer => { calcScore = answer.correct ? calcScore + answer.bid / 2 : calcScore })
            return calcScore;
        }
    },
    "bid2468_2part": {
        "answers": 2,
        "label": "Two Answers - Bid 2,4,6,8",
        "instructions": "Bid 2,4,6, or 8. You may bid each point value only once. Each correct answer is equal to half of your bid.",
        "score": (answers) => {
            let calcScore = 0;
            answers.forEach(answer => { calcScore = answer.correct ? calcScore + answer.bid / 2 : calcScore })
            return calcScore;
        }
    },
    "4part2point": {
        "label": "4 Parter - 2 Points",
        "instructions": "Each correct answer is worth 2 points.",
        "score": (answers) => {
            let calcScore = 0;
            answers.forEach(answer => { calcScore = answer.correct ? calcScore + answer.bid : calcScore })
            return calcScore;
        }
    },
    "4part5point": {
        "label": "4 Parter - 5 Points",
        "instructions": "Each correct answer is worth 5 points.",
        "score": (answers) => {
            let calcScore = 0;
            answers.forEach(answer => { calcScore = answer.correct ? calcScore + answer.bid : calcScore })
            return calcScore;
        }
    },
    "10ptbonus": {
        "label": "10 Point Bonus",
        "instructions": "Bid from 2-10 in even numbers. If wrong, you will lose half of your bid.",
        "score": (answers) => { return answers[0].correct ? answers[0].bid : -1 * (answers[0].bid / 2); }
    },
    "20ptbonus": {
        "label": "20 Point Bonus",
        "instructions": "Bid from 2-20 in even numbers. If wrong, you will lose half of your bid.",
        "score": (answers) => { return answers[0].correct ? answers[0].bid : -1 * (answers[0].bid / 2); }
    }
}