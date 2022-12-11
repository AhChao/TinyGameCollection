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
            this.isChoosing = true;
            this.loadOperationPanel(this.playerTurn + '0');
        },
        loadOperationPanel(playerWithDir) {
            this.operationTarget = playerWithDir;
            this.operationDetection = [1, 1, 1, 1];
            this.updateValidCellToMove();
        },
        clickOperation(opDir) {
            this.operationTarget = this.operationTarget[0] + opDir;
            this.updateValidCellToMove();
        },
        updateValidCellToMove() {
            this.validCell = [];
            if (!this.isChoosing) return;
            if (this.chosen[0] == -1) {
                for (let i = 0; i < this.chessboard.length; i++) {
                    for (let j = 0; j < this.chessboard[i].length; j++) {
                        if ((i == 0 || i == 4 || j == 0 || j == 4) && this.getPosInfo(i, j) == '-') {
                            this.validCell.push([i, j]);
                        }
                    }
                }
                return;
            }
            let validDir = [[0, -1], [0, 1], [1, 0], [-1, 0]];
            let posInfo = "";
            let dir = "";
            for (let i in validDir) {
                dir = validDir[i];
                posInfo = this.getPosInfo(this.chosen[0] * 1 + dir[0] * 1, this.chosen[1] * 1 + dir[1] * 1);
                console.log(dir, validDir[dir], this.chosen, this.chosen[0] + dir[0], this.chosen[1] + dir[1], posInfo);
                if (posInfo == "O") continue;
                if (posInfo == "-") {
                    this.validCell.push([this.chosen[0] + dir[0], this.chosen[1] + dir[1]]);
                    continue;
                }
            }
        },
        selectCell(lineIndex, cellIndex) {
            if (this.isChoosing) {
                if (!this.isValidStep(lineIndex, cellIndex)) return;
                this.chessboard[lineIndex][cellIndex] = this.operationTarget;
                this.turnCount += this.playerTurn == "B" ? 1 : 0;
                if (this.chosen[0] == -1) {
                    this.chessCount[this.playerTurn == "A" ? 0 : 1]--;
                }
                this.playerTurn = this.playerTurn == "A" ? "B" : "A";
                this.isChoosing = false;
                this.loadOperationPanel(this.playerTurn + '0');
                if (this.turnCount == 3) {
                    if (this.chessboard[0][2] == "X") this.chessboard[0][2] = "-";
                    if (this.chessboard[4][2] == "X") this.chessboard[4][2] = "-";
                    //TODO:X should only block place, not block move, and even moved into, first two round should not be entered;
                    //Not yet deal on it, if first two round some one enter, then second one can push the chess on the X
                }

                return;
            }
            if (this.getPosInfo(lineIndex, cellIndex)[0] == this.playerTurn) {
                this.chosen = [lineIndex, cellIndex];
                this.isChoosing = true;
                this.loadOperationPanel(this.getPosInfo(lineIndex, cellIndex));
            }
        },
        getPosInfo(lineIndex, cellIndex) {
            try {
                return this.chessboard[lineIndex][cellIndex];
            }
            catch (e) {
                return 'O';//out of bound
            }
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