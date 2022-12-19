const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            diceSide: ["mouse", "cheese2", "cat", "cheese1", "mouse", "cheese0"],//front, bottom, back, top, left, right
            lastStepChessboard: [],
            validCell: [],
            chosen: [0, 0],
            isChoosing: false,
            playerTurn: 1,//1 - n
            playerCount: 2,
            randomMin: 1,
            randomMax: 30,
            diceCount: 13,
            remainDiceCount: [13],
            rollResult: {},
            playerColor: ["#DCDCDC", "#DCDCDC"],
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.lastStepChessboard = [];
            this.validCell = [];
            this.isChoosing = false;
            this.playerTurn = 1;
        },
        changeColor(index) {
            document.getElementById("color_input" + index).click();
        },
        getRandom(max, min) {
            return (Math.floor(Math.random() * (max - min)) + min) * 90;
        },
        rollTheDices() {
            let diceId = "";
            let cube = "";
            let xRand = 0;
            let yRand = 0;
            let singleResult = "";
            this.rollResult = {};
            for (let i = 1; i <= this.remainDiceCount[this.playerTurn - 1]; i++) {
                diceId = "dice" + i;
                cube = document.getElementById(diceId);
                xRand = this.getRandom(this.randomMax, this.randomMin);
                yRand = this.getRandom(this.randomMax, this.randomMin);
                cube.style.webkitTransform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
                cube.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
                singleResult = this.checkDiceFace(xRand, yRand);
                if (!(singleResult in this.rollResult)) {
                    this.rollResult[singleResult] = 0;
                }
                this.rollResult[singleResult]++;
            }
        },
        checkDiceFace(degX, degY) {
            if (degX % 360 == 0) {
                switch (degY % 360) {
                    case 90:
                        return "mouse";
                    case 180:
                        return "cat";
                    case 270:
                        return "cheese0"
                    case 0:
                        return "mouse";
                }
            }
            else if (degX % 360 == 90) {
                return "cheese2";
            }
            else if (degX % 360 == 180) {
                switch (degY % 360) {
                    case 90:
                        return "cheese0";
                    case 180:
                        return "mouse";
                    case 270:
                        return "mouse"
                    case 0:
                        return "cat";
                }
            }
            else if (degX % 360 == 270) {
                return "cheese1";
            }

        },
        WonTheGameBy(chessOwner) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = "Player " + chessOwner + " Won The Game!";
        }
    }
});
app.mount('#app');