const app = Vue.createApp({
    created() { },
    data() {
        return {
            playerTurn: "0",
            boardArray: [],
            boardWithChickenOnly: [],
            playerCount: 2, // 2-4, 3-3, 4-2
            placedChicken: 0,
            shouldPlacedChicken: 8,
            playerScore: [0, 0],
            placePhase: true,
            chickenPlace: [],
            isChoosing: false,
            chosen: [],
            validCell: [],
            validCellImage: [],//max21
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.boardArray = [];//7-8-7, worm 1*30, 2*20, 3*10
            this.boardWithChickenOnly = [];
            this.drawField();
            this.playerCount = 2;//TODO:fix as 2 for now, max should support 4
            this.placedChicken = 0;
            this.shouldPlacedChicken = (6 - this.playerCount) * this.playerCount;
            this.chickenPlace = [[[-1, -1], [-1, -1], [-1, -1], [-1, -1]], [[-1, -1], [-1, -1], [-1, -1], [-1, -1]]];
            this.playerScore = [0, 0];
            this.placePhase = true;
            this.validCell = [];
        },
        drawField() {
            let wormOrder = [];
            for (let i = 0; i < 30; i++) wormOrder.push(1);
            for (let i = 0; i < 20; i++) wormOrder.push(2);
            for (let i = 0; i < 10; i++) wormOrder.push(3);
            for (let i = wormOrder.length - 1; i > 0; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                [wormOrder[i], wormOrder[rand]] = [wormOrder[rand], wormOrder[i]];
            }
            for (let i = 0; i < 8; i++) {
                this.boardArray.push([]);
                this.boardWithChickenOnly.push([]);
                for (let j = 0; (i % 2 == 1 ? j < 8 : j < 7); j++) {
                    this.boardArray[i].push(wormOrder.pop());
                    this.boardWithChickenOnly[i].push('-');
                }
            }
        },
        selectCell(lineIndex, cellIndex) {
            if (this.placePhase) {
                if (!this.checkPosAbleToStand(lineIndex, cellIndex)) return;
                if (this.boardArray[lineIndex][cellIndex] != 1) return;//only can start from cell with one worm
                for (let i = 0; i < this.chickenPlace[this.playerTurn].length; i++) {
                    if (this.chickenPlace[this.playerTurn][i][0] == -1) {
                        this.chickenPlace[this.playerTurn][i][0] = lineIndex;
                        this.chickenPlace[this.playerTurn][i][1] = cellIndex;
                        this.boardWithChickenOnly[lineIndex][cellIndex] = this.playerTurn + '_' + i;
                        this.placedChicken++;
                        this.nextPlayer();
                        if (this.placedChicken == this.shouldPlacedChicken) this.placePhase = false;
                        break;
                    }
                }
            }
            else {
                let cellInfo = this.boardWithChickenOnly[lineIndex][cellIndex];
                if (this.isChoosing) {
                    if (cellInfo[0] == this.playerTurn) {
                        this.chosen = [lineIndex, cellIndex];
                        this.updateValidCell(lineIndex, cellIndex);
                        return;
                    }
                    if (!this.isValidCell(lineIndex, cellIndex)) return;
                    let cellInfoOfChosen = this.boardWithChickenOnly[this.chosen[0]][this.chosen[1]];
                    this.playerScore[this.playerTurn] += this.boardArray[this.chosen[0]][this.chosen[1]];
                    this.boardArray[this.chosen[0]][this.chosen[1]] = -1;
                    this.boardWithChickenOnly[this.chosen[0]][this.chosen[1]] = '-';
                    this.boardWithChickenOnly[lineIndex][cellIndex] = cellInfoOfChosen;
                    let chickenInfo = cellInfoOfChosen.split("_");
                    this.chickenPlace[chickenInfo[0]][chickenInfo[1]] = [lineIndex, cellIndex];
                    this.isChoosing = false;
                    this.validCell = [];
                    this.validCellImage = [];
                    this.nextPlayer();

                }
                else {
                    if (this.playerTurn != cellInfo[0]) {
                        return;
                    }
                    this.chosen = [lineIndex, cellIndex];
                    this.updateValidCell(lineIndex, cellIndex);
                    this.isChoosing = true;
                }
            }
        },
        getCoodX(lineIndex, cellIndex) {
            return cellIndex * 80 + (lineIndex % 2 == 0 ? 40 : 0);
        },
        getCoodY(lineIndex) {
            return lineIndex * 61;
        },
        checkPosAbleToStand(lineIndex, cellIndex) {
            return this.boardWithChickenOnly[lineIndex][cellIndex] == '-' && this.boardArray[lineIndex][cellIndex] != -1;
        },
        nextPlayer() {
            let playerNotAbleToMove = 0;
            this.playerTurn = this.playerTurn * 1 + 1;
            if (this.playerTurn == this.playerCount) this.playerTurn = 0;

            while (!this.placePhase && this.checkIsNoPlaceToMove(this.playerTurn)) {
                this.playerTurn = this.playerTurn * 1 + 1;
                if (this.playerTurn == this.playerCount) this.playerTurn = 0;
                playerNotAbleToMove++;
                if (playerNotAbleToMove == this.playerCount) {
                    this.gameEnd();
                    break;
                }
            }
        },
        updateValidCell(lineIndex, cellIndex) {
            this.validCell = [];
            this.validCellImage = [];
            for (let i = cellIndex - 1; i >= 0; i--)//to left
            {
                if (this.checkPosAbleToStand(lineIndex, i)) this.validCell.push([lineIndex, i]);
                else break;
            }
            for (let i = cellIndex + 1; (lineIndex % 2 == 1 ? i < 8 : i < 7); i++)//to right
            {
                if (this.checkPosAbleToStand(lineIndex, i)) this.validCell.push([lineIndex, i]);
                else break;
            }
            for (let i = lineIndex - 1, j = cellIndex - (Math.abs(i - 1) % 2 == 1 ? 1 : 0); i >= 0;) {//to left upper
                if (this.checkPosAbleToStand(i, j)) this.validCell.push([i, j]);
                else break;
                i--;
                if (i % 2 == 0) j--;
            }
            for (let i = lineIndex - 1, j = cellIndex + ((i - 1) % 2 == 0 ? 1 : 0); i >= 0;) {//to right upper
                if (this.checkPosAbleToStand(i, j)) this.validCell.push([i, j]);
                else break;
                i--;
                if (i % 2 == 1) j++;
            }
            for (let i = lineIndex + 1, j = cellIndex - ((i - 1) % 2 == 1 ? 1 : 0); i < 8;) {//to left bottom
                if (this.checkPosAbleToStand(i, j)) this.validCell.push([i, j]);
                else break;
                i++;
                if (i % 2 == 0) j--;
            }
            for (let i = lineIndex + 1, j = cellIndex + ((i - 1) % 2 == 0 ? 1 : 0); i < 8;) {//to right bottom
                if (this.checkPosAbleToStand(i, j)) this.validCell.push([i, j]);
                else break;
                i++;
                if (i % 2 == 1) j++;
            }

            let len = this.validCell.length;
            if (len == 0) return 0;
            for (let i = 0; i < 21; i++) {
                this.validCellImage.push(this.validCell[i % len]);
            }
            return len;
        },
        isValidCell(lineIndex, cellIndex) {
            for (let i = 0; i < this.validCell.length; i++) {
                if (lineIndex == this.validCell[i][0] && cellIndex == this.validCell[i][1]) return true;
            }
            return false;
        },
        checkIsNoPlaceToMove(player) {
            for (let i = 0; i < this.chickenPlace[player].length; i++) {
                if (this.updateValidCell(this.chickenPlace[player][i][0], this.chickenPlace[player][i][1]) != 0) {
                    this.validCell = [];
                    this.validCellImage = [];
                    return false;
                }
            }
            this.validCell = [];
            this.validCellImage = [];
            return true;
        },
        gameEnd() {
            let winner = 0;
            let max = this.playerScore[0];
            for (let i = 1; i < this.playerCount; i++) {
                if (this.playerScore[i] > max) {
                    winner = i;
                    max = this.playerScore[i];
                }
            }
            alert("Player " + winner + " Won The Game With " + max + " Worms!");
        },
        initWithMoreThanTwoPlayer() {
            this.init();
            let inputPlayerCount = prompt("Please enter preferred players in the game(2 - 4):", "2");
            if (inputPlayerCount == null || inputPlayerCount < 2 || inputPlayerCount > 4) {
                inputPlayerCount = 2;
            }
            this.playerCount = inputPlayerCount;
            this.shouldPlacedChicken = (6 - this.playerCount) * this.playerCount;
            this.chickenPlace = [];
            this.playerScore = [];
            for (let i = 0; i < this.playerCount; i++) {
                this.chickenPlace.push([]);
                this.playerScore.push(0);
                for (let j = 0; j < (6 - this.playerCount); j++) {
                    this.chickenPlace[i].push([-1, -1]);
                }
            }
        }
    },
});
app.mount('#app');