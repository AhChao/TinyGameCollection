const app = Vue.createApp({
    created() { },
    data() {
        return {
            diceSide: ["mouse", "cheese2", "cat", "cheese1", "mouse", "cheese0"],//front, bottom, back, top, left, right
            chosen: [-1],
            playerTurn: 1,//1 - n
            playerCount: 2,
            randomMin: 1,
            randomMax: 30,
            diceCount: 13,
            remainDiceCount: 13,
            rollResult: [],
            choseList: [],
            playerColor: ["#DCDCDC", "#DCDCDC"],
            phase: "roll"//roll - wait - choosing
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
            this.rollResult = [];
            for (let i = 1; i <= this.remainDiceCount; i++) {
                diceId = "dice" + i;
                cube = document.getElementById(diceId);
                xRand = this.getRandom(this.randomMax, this.randomMin);
                yRand = this.getRandom(this.randomMax, this.randomMin);
                cube.classList.remove('notransition');
                cube.style.webkitTransform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
                cube.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
                this.rollResult.push(this.checkDiceFace(xRand, yRand));
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
        clickOnDice(diceIndex) {
            console.log(diceIndex, this.phase);
            if (this.phase == "roll") {
                this.chosen = -1;
                this.rollTheDices();
                this.phase = "wait";
                this.waitForDiceAnimate();
            }
            if (this.phase == "choosing") {
                this.chosen = diceIndex;
                console.log(this.getIndexWithPattern(this.rollResult[this.chosen - 1]));
            }
        },
        waitForDiceAnimate() {
            setTimeout(() => { this.phase = "catPicking"; this.waitForCatPicking(); }, 3000);
        },
        waitForCatPicking() {
            setTimeout(() => {
                this.catPicking();
                if (this.checkPickingAvailable()) {
                    this.phase = "choosing";
                }
                else {
                    this.turnEnd();
                }
            }, 2000);
        },
        getIndexWithPattern(pattern) {
            if (this.rollResult.length == 0) return [];
            return this.rollResult.reduce((arr, element, index) => {
                if (element === pattern)
                    arr.push(index);
                return arr;
            }, []);
            //ref : https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
        },
        catPicking() {
            let elementIndexes = this.getIndexWithPattern("cat");
            let elementCount = elementIndexes.length;
            if (!("cat" in this.choseList)) this.choseList["cat"] = 0;
            this.choseList["cat"] += elementCount;
            this.switchDisplayForPattern("cat");
        },
        confirmChosen() {
            let chosenElement = this.rollResult[this.chosen - 1];
            let elementIndexes = this.getIndexWithPattern(chosenElement);
            let elementCount = elementIndexes.length;
            if (chosenElement in this.choseList) {
                if (chosenElement != "mouse") return;
                this.choseList["mouse"] += elementCount;
            }
            else {
                this.choseList[chosenElement] = elementCount;
            }
            this.switchDisplayForPattern(chosenElement);
            if (!this.checkPickingAvailable()) {
                console.log("No need to roll");
            }
            this.phase = "roll";
        },
        checkPickingAvailable() {
            if (("cheese0" in this.choseList) && ("cheese1" in this.choseList) && ("cheese2" in this.choseList) && !this.rollResult.some("mouse")) return false;
            if (("cat" in this.choseList) && this.choseList["cat"] > this.remainDiceCount + (("mouse" in this.choseList) ? this.choseList["mouse"] : 0)) return false;
            return true;
        },
        switchDisplayForPattern(pattern) {
            let temp = "";
            for (let i = 0; i < this.remainDiceCount; i++) {
                document.getElementById("dice" + (i * 1 + 1)).classList.add('notransition');
                if (this.rollResult[i] == pattern) {
                    for (let j = i + 1; j < this.remainDiceCount; j++) {
                        if (this.rollResult[j] == pattern) continue;
                        [this.rollResult[i], this.rollResult[j]] = [this.rollResult[j], this.rollResult[i]];
                        temp = document.getElementById("dice" + (i * 1 + 1)).style.transform;
                        document.getElementById("dice" + (i * 1 + 1)).style.transform = document.getElementById("dice" + (j * 1 + 1)).style.transform;
                        document.getElementById("dice" + (j * 1 + 1)).style.transform = temp;
                        break;
                    }
                }
            }
            this.rollResult = this.rollResult.filter(item => item !== pattern);
            this.remainDiceCount = this.rollResult.length;
        },
        showMessageWithToast(msg) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = msg;
        }
    }
});
app.mount('#app');