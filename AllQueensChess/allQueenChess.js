const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            validCell: [],
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
            this.lastStepChessboard = [];
            this.validCell = [];
            this.isChoosing = false;
            this.playerTurn = "A";
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
                    this.updateValidCellToMove(lineIndex, cellIndex);
                    return;
                }
                if (this.isValidStep(lineIndex, cellIndex)) {
                    this.lastStepChessboard = JSON.parse(JSON.stringify(this.chessboard));
                    this.chessboard[this.chosen[0]][this.chosen[1]] = '-';
                    this.chessboard[lineIndex][cellIndex] = this.playerTurn;
                    this.isChoosing = false;
                    this.validCell = [];
                    this.playerTurn = this.playerTurn == 'A' ? 'B' : 'A';
                    this.isWinTheGameByLastChess(lineIndex, cellIndex);
                    return;
                }
                return;
            }
            this.chosen = [lineIndex, cellIndex];
            this.isChoosing = true;
            this.updateValidCellToMove(lineIndex, cellIndex);
        },
        getPosInfo(lineIndex, cellIndex) {
            return this.chessboard[lineIndex][cellIndex];
        },
        updateValidCellToMove(lineIndex, cellIndex) {
            this.validCell = [];
            for (let i = lineIndex - 1; i >= 0; i--) {
                if (this.getPosInfo(i, cellIndex) == '-') this.validCell.push([i, cellIndex]);
                else break;
            }
            for (let i = lineIndex + 1; i <= 4; i++) {
                if (this.getPosInfo(i, cellIndex) == '-') this.validCell.push([i, cellIndex]);
                else break;
            }
            for (let i = cellIndex - 1; i >= 0; i--) {
                if (this.getPosInfo(lineIndex, i) == '-') this.validCell.push([lineIndex, i]);
                else break;
            }
            for (let i = cellIndex + 1; i <= 4; i++) {
                if (this.getPosInfo(lineIndex, i) == '-') this.validCell.push([lineIndex, i]);
                else break;
            }
            for (let i = lineIndex + 1, j = cellIndex + 1; i <= 4; i++, j++) {
                if (this.getPosInfo(i, j) == '-') this.validCell.push([i, j]);
                else break;
            }
            for (let i = lineIndex - 1, j = cellIndex - 1; i >= 0; i--, j--) {
                if (this.getPosInfo(i, j) == '-') this.validCell.push([i, j]);
                else break;
            }
            for (let i = lineIndex - 1, j = cellIndex + 1; i >= 0; i--, j++) {
                if (this.getPosInfo(i, j) == '-') this.validCell.push([i, j]);
                else break;
            }
            for (let i = lineIndex + 1, j = cellIndex - 1; i <= 4; i++, j--) {
                if (this.getPosInfo(i, j) == '-') this.validCell.push([i, j]);
                else break;
            }

        },
        isValidStep(lineIndex, cellIndex) {
            return this.validCell.some(cell => {
                return cell[0] == lineIndex && cell[1] == cellIndex;
            });
        },
        revertLastStep() {
            this.chessboard = JSON.parse(JSON.stringify(this.lastStepChessboard));
            this.playerTurn = this.playerTurn == 'A' ? 'B' : 'A';
            this.isChoosing = false;
            this.validCell = [];
        },
        isWinTheGameByLastChess(lineIndex, cellIndex) {
            let lastChessOwner = this.getPosInfo(lineIndex, cellIndex);
            let count = 1;
            for (let i = lineIndex - 1; i >= 0; i--) {
                if (this.getPosInfo(i, cellIndex) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = lineIndex + 1; i <= 4; i++) {
                if (this.getPosInfo(i, cellIndex) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = cellIndex - 1; i >= 0; i--) {
                if (this.getPosInfo(lineIndex, i) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = cellIndex + 1; i <= 4; i++) {
                if (this.getPosInfo(lineIndex, i) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = lineIndex + 1, j = cellIndex + 1; i <= 4; i++, j++) {
                if (this.getPosInfo(i, j) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = lineIndex - 1, j = cellIndex - 1; i >= 0; i--, j--) {
                if (this.getPosInfo(i, j) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = lineIndex - 1, j = cellIndex + 1; i >= 0; i--, j++) {
                if (this.getPosInfo(i, j) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
            }
            count = 1;
            for (let i = lineIndex + 1, j = cellIndex - 1; i <= 4; i++, j--) {
                if (this.getPosInfo(i, j) == lastChessOwner) {
                    count++;
                    if (count == 4) this.WonTheGameBy(lastChessOwner);
                }
                else break;
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