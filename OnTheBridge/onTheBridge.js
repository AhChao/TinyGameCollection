const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            validCell: [],
            chosen: [0, 0],
            isChoosing: false,
            playerTurn: "W",
            waitingPlaceW: [],
            waitingPlaceB: [],
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.rollForSheeps();
            this.lastStepChessboard = [];
            this.validCell = [];
            this.isChoosing = false;
            this.playerTurn = "W";
            this.drawField();
        },
        drawField() {
            for (let i = 0; i < 10; i++) {
                this.chessboard[i] = ['-', '-', '-', '-', '-', '-'];
            }

        },
        rollForSheeps() {
            let wbCount = Math.floor(Math.random() * 3) + 1;
            let bbCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < 5; i++) {
                if (wbCount > 0) {
                    wbCount--;
                    this.waitingPlaceW.push("WB");
                }
                else {
                    this.waitingPlaceW.push("WW");
                }
                if (bbCount > 0) {
                    bbCount--;
                    this.waitingPlaceB.push("BB");
                }
                else {
                    this.waitingPlaceB.push("BW");
                }
            }
        },
        getPosInfo(lineIndex, cellIndex) {
            if (lineIndex < 0) {
                if (lineIndex == -1) return this.waitingPlaceW[cellIndex];
                if (lineIndex == -2) return this.waitingPlaceB[cellIndex];
            }
            return this.chessboard[lineIndex][cellIndex];
        },
        selectCell(lineIndex, cellIndex) {
            let selectedCell = this.getPosInfo(lineIndex, cellIndex);
            if (this.isChoosing == false) {
                if (lineIndex >= 0 && (cellIndex == 0 || cellIndex == 5)) return;
                if (selectedCell[0] != this.playerTurn) return;
                this.isChoosing = true;
                this.chosen = [lineIndex, cellIndex];
                this.updateValidCell();
            }
            else {
                if ((cellIndex == 0 || cellIndex == 5) && this.getPosInfo(lineIndex, cellIndex) != '-' && lineIndex >= 0) return;
                if (selectedCell[0] == this.playerTurn) {
                    this.chosen = [lineIndex, cellIndex];
                    this.updateValidCell();
                    return;
                }
                if (selectedCell[0] != '-') return;
                if (lineIndex == this.validCell[0] && cellIndex == this.validCell[1]) {
                    if (this.chosen[0] < 0) {//select from waiting place
                        this.chessboard[lineIndex][cellIndex] = this.getPosInfo(this.chosen[0], this.chosen[1]);
                        if (this.chosen[0] == -1) this.waitingPlaceW.splice(this.chosen[1], 1);
                        if (this.chosen[0] == -2) this.waitingPlaceB.splice(this.chosen[1], 1);
                    }
                    else {//swtich all sheep above the moving one
                        let topLineI = this.getTopNonEmptyIndexOfTheColumn(this.chosen[1]);
                        for (let lineI = this.chosen[0]; lineI >= topLineI; lineI--, lineIndex--) {
                            [this.chessboard[lineI][this.chosen[1]], this.chessboard[lineIndex][cellIndex]] = [this.chessboard[lineIndex][cellIndex], this.chessboard[lineI][this.chosen[1]]];
                        }
                        //If send enemy's sheep to your home, trigger option to let the enemy do chossing
                        this.checkBringBackHome();
                    }
                    this.isChoosing = false;
                    this.playerTurn = this.playerTurn == 'W' ? 'B' : 'W';
                    this.wonDetection();
                }

            }
        },
        updateValidCell() {
            if (this.chosen[0] < 0) {
                let validCellIndex = this.getTheFirstDifferentBackgroundCellIndex(this.chosen[0] == -1 ? 1 : 4, this.getPosInfo(this.chosen[0], this.chosen[1])[1], this.chosen[0] == -1 ? 1 : -1);
                this.validCell = [this.getTopEmptyIndexOfTheColumn(validCellIndex), validCellIndex];
                return;
            }
            let chosenInfo = this.getPosInfo(this.chosen[0], this.chosen[1]);
            let dir = chosenInfo[0] == 'W' ? 1 : -1;
            let validCellIndex = this.getTheFirstDifferentBackgroundCellIndex(this.chosen[1] + dir, chosenInfo[1], dir);
            this.validCell = [this.getTopEmptyIndexOfTheColumn(validCellIndex), validCellIndex];
        },
        getTheFirstDifferentBackgroundCellIndex(startIndex, backgroundColor, dir) {
            for (let i = startIndex; (dir == 1 ? i < 5 : i > 0); i += dir) {
                if (this.getPosInfo(this.getTopNonEmptyIndexOfTheColumn(i), i)[1] != backgroundColor) {
                    return i;
                }
            }
            return dir == 1 ? 5 : 0;
        },
        getTopNonEmptyIndexOfTheColumn(cellIndex) {
            for (let i = 0; i < 9; i++) {
                if (this.getPosInfo(i, cellIndex) != '-') return i;
            }
            return 9;
        },
        getTopEmptyIndexOfTheColumn(cellIndex) {
            for (let i = 9; i > 0; i--) {
                if (this.getPosInfo(i, cellIndex) == '-') return i;
            }
            return 0;
        },
        checkBringBackHome() {
            let lineIdList = [];
            let checkingCellId = this.playerTurn == 'W' ? 5 : 0;
            for (let i = 0; i < 10; i++) {
                if (this.playerTurn == 'W' && this.getPosInfo(i, 5)[0] == 'B') lineIdList.push(i);
                if (this.playerTurn == 'B' && this.getPosInfo(i, 0)[0] == 'W') lineIdList.push(i);
            }
            if (lineIdList.length == 0) return;
            let message = "Player " + (this.playerTurn == 'W' ? 'B' : 'W') + "'s Sheep was bring back to grass!\nChoose which background of sheep you want.\nOk to be White, Cancel to be Black."
            for (let i = 0; i < lineIdList.length; i++) {
                this.chessboard[lineIdList[i]][checkingCellId] = '-';
                let chessName = this.playerTurn == 'W' ? "B" : "W";//if player W time, only will send back B sheep
                if (confirm(message)) chessName += "W";
                else chessName += "B";
                if (this.playerTurn == 'W') this.waitingPlaceB.push(chessName);
                else this.waitingPlaceW.push(chessName);
            }
        },
        wonDetection() {
            let leftWhiteSheep = this.waitingPlaceW.length;
            let leftBlackSheep = this.waitingPlaceB.length;
            for (let i = 0; i < this.chessboard.length; i++) {
                for (let j = 1; j < this.chessboard[i].length - 1; j++) {
                    if (this.chessboard[i][j][0] == 'W') leftWhiteSheep++;
                    if (this.chessboard[i][j][0] == 'B') leftBlackSheep++;
                }
            }
            if (leftWhiteSheep == 0) alert("White Sheep Won The Game!");
            if (leftBlackSheep == 0) alert("Black Sheep Won The Game!");
        }
    }
});
app.mount('#app');