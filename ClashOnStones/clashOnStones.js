const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            validCell: [],
            chosen: [0, 0],
            isChoosing: false,
            operationTarget: "A0",
            operationDetection: [0, 1, 1, 1],
            playerTurn: "A",
            turnCount: 1,
            chessCount: [5, 5],
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
            this.turnCount = 1;
            this.playerTurn = "A";
            this.operationTarget = "A0";
            this.operationDetection = [1, 1, 1, 1];
            this.chessCount = [5, 5];
            this.drawField();
        },
        drawField() {
            for (let i = 0; i < 5; i++) {
                this.chessboard[i] = ['-', '-', '-', '-', '-'];
                for (let j = 0; j < 5; j++) {
                    if (i == 2 && j != 0 && j != 4) { this.chessboard[i][j] = 'S'; }
                    if ((i == 0 || i == 4) && j == 2) { this.chessboard[i][j] = 'X'; }
                }
            }
        },
        choosingWaitingZone(playerName) {
            if (this.playerTurn != playerName) {
                return;
            }
            this.chosen = [-1, this.playerTurn == 'A' ? 1 : 2];
            this.loadOperationPanel(this.playerTurn + '0');
        },
        loadOperationPanel(playerWithDir) {
            this.operationTarget = playerWithDir;
            this.operationDetection = [1, 1, 1, 1];
        },
        clickOperation(opDir) {
            this.operationTarget = this.operationTarget[0] + opDir;
            this.updateValidCellToMove();
        },
        updateValidCellToMove() {
            this.operationDetection = [1, 1, 1, 1];
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
                    this.lastStepChessboard.push(JSON.parse(JSON.stringify(this.chessboard)));
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
        isValidStep(lineIndex, cellIndex) {
            return this.validCell.some(cell => {
                return cell[0] == lineIndex && cell[1] == cellIndex;
            });
        },
        revertLastStep() {
            if (this.lastStepChessboard.length == 0) return;
            this.chessboard = JSON.parse(JSON.stringify(this.lastStepChessboard.pop()));
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