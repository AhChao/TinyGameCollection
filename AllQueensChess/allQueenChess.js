const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            chosen: [0, 0],
            isChoosing: false,
            playerTurn: "A",
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.drawField();
        },
        drawField() {
            for (let i = 0; i < 5; i++) {
                this.chessboard[i] = ['-', '-', '-', '-', '-'];
                for (let j = 0; j < 5; j++) {
                    if (i == 0) { this.chessboard[i][j] = j % 2 == 0 ? 'B' : 'A'; }
                    else if (i == 4) { this.chessboard[i][j] = j % 2 == 0 ? 'A' : 'B'; }
                    else if (i == 2 && j == 0) { this.chessboard[i][j] = 'A' }
                    else if (i == 2 && j == 4) { this.chessboard[i][j] = 'B' }
                }
            }
        },
        selectCell(lineIndex, cellIndex) {
            if (this.getPosInfo(lineIndex, cellIndex) != this.playerTurn && !this.isChoosing) return;
            if (this.isChoosing) {
                if (this.getPosInfo(lineIndex, cellIndex) == this.playerTurn) {
                    this.chosen = [lineIndex, cellIndex];
                    this.isChoosing = true;
                    return;
                }
                if (this.isValidStep(this.chosen, [lineIndex, cellIndex])) {
                    this.chessboard[this.chosen[0]][this.chosen[1]] = '-';
                    this.chessboard[lineIndex][cellIndex] = this.playerTurn;
                    this.isChoosing = false;
                    this.playerTurn = this.playerTurn == 'A' ? 'B' : 'A';
                    return;
                }
                return;
            }
            this.chosen = [lineIndex, cellIndex];
            this.isChoosing = true;
        },
        isValidStep(lastPos, newPos) {
            let oldX = lastPos[0];
            let oldY = lastPos[1];
            let newX = newPos[0];
            let newY = newPos[1];
            if (this.getPosInfo(newX, newY) != '-') return false;
            return true;
        },
        getPosInfo(lineIndex, cellIndex) {
            return this.chessboard[lineIndex][cellIndex];
        }
    }
});
app.mount('#app');