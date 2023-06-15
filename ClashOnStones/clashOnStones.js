const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            validCell: [],
            cellNeedToPush: [],
            chosen: [0, 0],
            isChoosing: false,
            operationTarget: "A0",//0 means dir
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
            this.cellNeedToPush = [];
            this.isChoosing = false;
            this.turnCount = 1;
            this.playerTurn = "A";
            this.operationTarget = "A0";
            this.operationDetection = [1, 1, 1, 1];//which dir able ot choose
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
        clickOperation(opDir) {//Click on dir button
            this.operationTarget = this.operationTarget[0] + opDir;
            this.updateValidCellToMove();
        },
        updateValidCellToMove() {//calculate which cell is valid to move when selecting any chess
            this.validCell = [];
            this.lastStepChessboard = [];
            let pushResult = false;
            if (!this.isChoosing) return;
            if (this.chosen[0] == -1) {//select from waiting zone
                for (let i = 0; i < this.chessboard.length; i++) {
                    for (let j = 0; j < this.chessboard[i].length; j++) {
                        pushResult = this.isAbleToPush(this.operationTarget, [-1, 0], [i, j])
                        if ((i == 0 || i == 4 || j == 0 || j == 4) && (this.getPosInfo(i, j) == '-' || pushResult)) {
                            //when move from waiting zone, must be in edge of the board
                            //the place should be able to push either is space
                            this.validCell.push([i, j]);
                            if (pushResult) this.cellNeedToPush.push([i, j]);
                            //why need push step diff from valid cell?
                            //push step may affect other chess to move
                        }
                    }
                }
                return;
            }
            //for chess already on the board
            let validDir = [[0, -1], [0, 1], [1, 0], [-1, 0]];
            let posInfo = "";
            let newPos = [];
            let dir = "";
            for (let i in validDir) {
                dir = validDir[i];
                newPos = [this.chosen[0] * 1 + dir[0] * 1, this.chosen[1] * 1 + dir[1] * 1];
                posInfo = this.getPosInfo(newPos[0], newPos[1]);
                if (posInfo == "O") continue;
                pushResult = this.isAbleToPush(this.getPosInfo(this.chosen[0], this.chosen[1]), this.chosen, newPos)
                if (posInfo == "-" || pushResult) {//if new pos is space or able to move, add to valid list
                    this.validCell.push([newPos[0], newPos[1]]);
                    if (pushResult) this.cellNeedToPush.push([newPos[0], newPos[1]]);
                    continue;
                }
            }
        },
        selectCell(lineIndex, cellIndex) {
            if (this.isChoosing) {
                if (!this.isValidStep(lineIndex, cellIndex)) return;
                if (this.isPushStep(lineIndex, cellIndex)) {
                    let pushDir = [lineIndex - this.chosen[0], cellIndex - this.chosen[1]];
                    let tempStack = [];//[lineIndex,cellIndex,whatToPut];
                    let movingCood = [];
                    let pushedTarget = "";//the one got pushed, cal by chosen chess pos and new pos(the value pass into this function)
                    console.log(pushDir);
                    if (pushDir[0] > 0) {//update all chesses affected, need to fix bug
                        for (let i = 1; i <= 5; i++) {
                            movingCood = [this.chosen[0] * 1 + pushDir[0] * i, this.chosen[1]];
                            pushedTarget = this.getPosInfo(lineIndex, cellIndex);
                            if (pushedTarget == '-') break;
                            if (pushedTarget == 'O') {
                                alert("Pushed Out!");
                            }
                            else {
                                tempStack.push([this.chosen[0] * 1 + pushDir[0] * (i + 1), chosen[1], this.getPosInfo[this.chosen[0] * 1 + pushDir[0] * i, this.chosen[1]]]);
                            }
                        }
                        for (let cmd in tempStack) {
                            this.chessboard[tempStack[cmd][0], tempStack[cmd][1]] = tempStack[cmd][2];
                        }
                    }
                    console.log(tempStack);
                }
                this.chessboard[lineIndex][cellIndex] = this.operationTarget;
                if (this.chosen[0] == -1) {//if choose from waiting zone, minus correspond player's chess count in waiting zone
                    this.chessCount[this.playerTurn == "A" ? 0 : 1]--;
                }
                else {//else make the orgin pos to be space due to move out
                    this.chessboard[this.chosen[0]][this.chosen[1]] = "-";
                }
                this.playerTurnFinish();
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
            //Possible Return
            //- : space, O : out of bound, A/B[num] : chess with dir, S : start place, X : not able to place in first few rounds
        },
        isValidStep(lineIndex, cellIndex) {
            return this.validCell.some(cell => {
                return cell[0] == lineIndex && cell[1] == cellIndex;
            });
        },
        isPushStep(lineIndex, cellIndex) {
            console.log("isPushStep", lineIndex, cellIndex, this.cellNeedToPush);
            return this.cellNeedToPush.some(cell => {
                return cell[0] == lineIndex && cell[1] == cellIndex;
            });
        },
        isAbleToRetreat() {
            if (!this.isChoosing || this.chosen[0] == -1) return false;
            return this.chosen[0] == 0 || this.chosen[0] == 4 || this.chosen[1] == 0 || this.chosen[1] == 4;
        },
        retreat() {
            this.chessboard[this.chosen[0]][this.chosen[1]] = "-";
            this.chessCount[this.playerTurn == "A" ? 0 : 1]++;
            this.playerTurnFinish();
        },
        isAbleToPush(moveingTarget, oriPos, newPos) {
            //Actually this is same to is Valid Cell, TODO: refactor
            let dir = [newPos[0] - oriPos[0], newPos[1] - oriPos[1]];
            //new place - old place, =0 means not that dir, pos means down[0] / right[1], neg means up[0] / left[1]
            //0-top 1-right 2-down 3-left
            let powerDir = dir[0] == 0 ? dir[1] > 0 ? 2 : 0 : dir[0] > 0 ? 1 : 3;
            //dir[0] == 0 means horizon(check [1]), else vertical (check [0])
            //powerDir means this dir will be pos for power calculation
            let decreaseDir = Math.abs(powerDir - 2);
            //decreaseDir is oppsite to powerdir in dir 0 - 2, 1 - 3
            let totalPower = 0;
            let powerInDecreaseDir = 0;
            let newPosInfo = "";
            if (oriPos[0] == -1 && this.getPosInfo(newPos[0], newPos[1]) == 'X') return false;
            //if try to put chess to X, it is not allowed
            for (let i = 0; i < 5; i++) {
                newPosInfo = this.getPosInfo(newPos[0], newPos[1]);
                if (newPosInfo == 'O' || newPosInfo == '-') break;
                console.log(newPosInfo);
                totalPower += newPosInfo[0] == 'S' ? 0 : newPosInfo[1] == powerDir ? 1 : 0;
                totalPower -= newPosInfo[0] == 'S' ? 1 : 0;
                powerInDecreaseDir += newPosInfo[1] == decreaseDir ? 1 : 0;
            }
            totalPower -= powerInDecreaseDir;
            if (totalPower > 0) return true;
            if (totalPower < 0) return false;
            if (totalPower == 0) return !(powerInDecreaseDir > 0);
            //When push a stone without beast in decrease dir, you can push
            return true;
        },
        playerTurnFinish() {
            this.turnCount += this.playerTurn == "B" ? 1 : 0;
            this.playerTurn = this.playerTurn == "A" ? "B" : "A";
            this.isChoosing = false;
            this.loadOperationPanel(this.playerTurn + '0');
            if (this.turnCount == 3) {
                if (this.chessboard[0][2] == "X") this.chessboard[0][2] = "-";
                if (this.chessboard[4][2] == "X") this.chessboard[4][2] = "-";
                //TODO:X should only block place, not block move, and even moved into, first two round should not be entered;
                //Not yet deal on it, if first two round some one enter, then second one can push the chess on the X
            }
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