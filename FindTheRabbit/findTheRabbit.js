const app = Vue.createApp({
    created() { },
    data() {
        return {
            playerCount: 2,
            questionMax: 15,
            objectArr: ["carrot", "eggplant", "grass", "hole", "rabbit"],
            objectOriginColorArr: ["orange", "purple", "greenyellow", "white"],
            questionObjectArr: [],
            questionObjectColorArr: [],
            questionCount: 0,
            answerOfTheQuestion: "",
            phase: "setup",
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.phase = "setup";
            this.playerCount = 2;
            this.questionMax = 15;
            this.questionCount = 0;
        },
        setupOk() {
            this.phase = "game";
            this.generateTheQuestion();
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
        generateTheQuestion() {
            let fuifillUniqueAnswer = false;
            let mapColorCount = 0;
            while (!fuifillUniqueAnswer) {
                this.mapColorCount = 0;
                this.questionObjectArr = this.shuffleArray(JSON.parse(JSON.stringify(this.objectArr))).slice(0, 2);
                this.questionObjectColorArr = this.shuffleArray(JSON.parse(JSON.stringify(this.objectOriginColorArr))).slice(0, 2);
                for (var i = 0; i < 2; i++) {
                    let objId = this.objectArr.indexOf(this.questionObjectArr[i]);
                    if (this.questionObjectColorArr[i] == this.objectOriginColorArr[objId]) {
                        mapColorCount++;
                        this.answerOfTheQuestion = this.questionObjectArr[i];
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
            }
            console.log(this.questionObjectArr, this.questionObjectColorArr, this.answerOfTheQuestion);
        },
        WonTheGameBy(name) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = "Player " + chessOwner + " Won The Game!";
        }
    }
});
app.mount('#app');