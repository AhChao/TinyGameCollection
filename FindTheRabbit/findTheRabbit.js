const app = Vue.createApp({
    created() { },
    data() {
        return {
            playerCount: 1,//1-2
            questionMax: 15,
            score: [],
            objectArr: ["carrot", "eggplant", "grass", "hole", "rabbit"],
            objectOriginColorArr: ["orange", "purple", "greenyellow", "brown", "white"],
            questionObjectArr: [],
            questionObjectColorArr: [],
            questionCount: 0,
            answerOfTheQuestion: "",
            phase: "setup",
            answerFilling: [],
            showScoreAnimation: false,
            timerInMileSecond: 0,
            timerInstance: {},
            isThePlayerAnswerCorrect: [false],
            detailAnswerResult: [],//{wrong:0,correct:0}
            modalMessage: "",
            answeringPlayerId: 0,
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        isSinglePlayer: function () { return this.playerCount == 1; },
        timerInSecond: function () { return (this.timerInMileSecond / 1000).toFixed(1);; },
    },
    methods: {
        init() {
            this.phase = "setup";
            this.playerCount = 1;
            this.score = [];
            this.questionMax = 15;
            this.questionCount = 0;
        },
        setupOk() {
            this.phase = "game";
            for (var i = 0; i < this.playerCount; i++) {
                this.score.push(0);
                this.answerFilling[i] = -1;
                this.isThePlayerAnswerCorrect[i] = false;
                this.detailAnswerResult[i] = { "wrong": 0, "correct": 0 }
            }
            this.generateTheQuestion();
            if (this.isSinglePlayer) {
                this.timerStart();
            }
        },
        getRandom(max) {//0-max-1
            return Math.floor(Math.random() * max);
        },
        shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = this.getRandom(i + 1);
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },
        submitAnswer(playerId, objId) {
            this.answeringPlayerId = playerId;
            this.answerFilling[playerId] = this.objectArr[objId];
            if (this.answerOfTheQuestion == this.objectArr[objId]) {
                this.score[playerId]++;
                this.detailAnswerResult[playerId]["correct"]++;
            }
            else {
                this.score[playerId]--;
                this.detailAnswerResult[playerId]["wrong"]++;
                for (let i = 0; i < this.playerCount; i++) {
                    if (i != playerId) {
                        this.score[i]++;
                    }
                }
            };
            this.isThePlayerAnswerCorrect[playerId] = this.answerFilling[playerId] == this.answerOfTheQuestion;
            this.showScoreAnimation = true;
            setTimeout(() => {
                this.showScoreAnimation = false;
            }, 1000);
            if (this.questionCount + 1 < this.questionMax) {
                this.generateTheQuestion();
                this.questionCount++;
            }
            else {
                this.settleTheGame();
                console.log("Settle The Game");
            }
        },
        generateTheQuestion() {
            let fuifillUniqueAnswer = false;
            let mapColorCount = 0;
            while (!fuifillUniqueAnswer) {
                mapColorCount = 0;
                this.questionObjectArr = this.shuffleArray(JSON.parse(JSON.stringify(this.objectArr))).slice(0, 2);
                this.questionObjectColorArr = this.shuffleArray(JSON.parse(JSON.stringify(this.objectOriginColorArr))).slice(0, 2);
                for (var i = 0; i < 2; i++) {
                    let objId = this.objectArr.indexOf(this.questionObjectArr[i]);
                    if (this.questionObjectColorArr[i] == this.objectOriginColorArr[objId]) {
                        mapColorCount++;
                        this.answerOfTheQuestion = this.questionObjectArr[i];
                    }
                }
                if (mapColorCount == 1) {
                    fuifillUniqueAnswer = true;
                }
                else if (mapColorCount == 0) {
                    let tempArr = JSON.parse(JSON.stringify(this.questionObjectArr));
                    tempArr.push(this.objectArr[this.objectOriginColorArr.indexOf(this.questionObjectColorArr[0])]);
                    tempArr.push(this.objectArr[this.objectOriginColorArr.indexOf(this.questionObjectColorArr[1])]);
                    if ([...new Set(tempArr)].length == 4) {
                        fuifillUniqueAnswer = true;
                        this.answerOfTheQuestion = this.objectArr.filter(x => !tempArr.includes(x));
                    }
                }
            }
        },
        WonTheGameBy(name) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = "Player " + chessOwner + " Won The Game!";
        },
        timerStart() {
            this.timerInMileSecond = 0;
            this.timerInstance = setInterval(() => {
                this.timerInMileSecond += 100;
            }, 100);
        },
        settleTheGame() {
            clearInterval(this.timerInstance);
            if (this.isSinglePlayer) {
                this.modalMessage =
                    "You finish the " + this.questionMax + " questions in " + this.timerInSecond + " seconds!\n" +
                    "Correct percentage is " + this.detailAnswerResult[0]["correct"] + " / " + this.questionMax + "\n" +
                    "Click the reset button to player a new game!";
            }
            else {
                let winner = -1;
                let winnerScore = -9999;
                for (let i = 0; i < this.playerCount; i++) {
                    if (winnerScore < this.score[i]) {
                        winner = i;
                        winnerScore = this.score[i];
                    }
                }
                this.modalMessage =
                    "Player " + (winner * 1 + 1) + " won the game with " + winnerScore + " points!\n" +
                    "You are very good at finding the rabbit!\n" +
                    "Click the reset button to player a new game!";
            }
            document.getElementById("modalBtn").click();
        }
    }
});
app.mount('#app');