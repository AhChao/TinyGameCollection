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
        isValidStep() {

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
                if (lineIndex == 0 || lineIndex == 5) return;
                if (selectedCell[0] != this.playerTurn) return;
                this.isChoosing = true;
                this.chosen = [lineIndex, cellIndex];
                this.updateValidCell();
            }
            else {
                if (selectedCell[0] == this.playerTurn) {
                    this.chosen = [lineIndex, cellIndex];
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
                        let dir = this.chosen[1]
                        let topNonEmtpyLine = this.getTopNonEmptyIndexOfTheColumn(this.chosen[1]);


                    }
                    this.isChoosing = false;
                    this.playerTurn = this.playerTurn == 'W' ? 'B' : 'W';
                }

            }
        },
        updateValidCell() {
            if (this.chosen[0] < 0) {
                let validCellIndex = this.getTheFirstDifferentBackgroundCellIndex(this.chosen[0] == -1 ? 1 : 4, this.getPosInfo(this.chosen[0], this.chosen[1])[1], this.chosen[0] == -1 ? 1 : -1);
                this.validCell = [this.getTopEmptyIndexOfTheColumn(validCellIndex), validCellIndex];
            }
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
        }

    }
});
app.mount('#app');