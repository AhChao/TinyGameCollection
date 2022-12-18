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
            playerTurn: "A",
            randomMin: 1,
            randomMax: 30
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
        getRandom(max, min) {
            return (Math.floor(Math.random() * (max - min)) + min) * 90;
        },
        rollTheDice() {
            let cube = document.getElementById('cube');
            let xRand = this.getRandom(this.randomMax, this.randomMin);
            let yRand = this.getRandom(this.randomMax, this.randomMin);
            cube.style.webkitTransform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
            cube.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
            this.WonTheGameBy(this.checkDiceFace(xRand, yRand));
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