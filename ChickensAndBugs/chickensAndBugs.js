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
            chosen: []
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
                        if (this.placedChicken == this.shouldPlacedChicken) this.placePhase = false;
                        this.nextPlayer();
                        break;
                    }
                }
            }
            else {
                let cellInfo = this.boardWithChickenOnly[lineIndex][cellIndex];
                if (this.isChoosing) {
                    if (cellInfo[0] == this.playerTurn) {
                        this.chosen = [lineIndex, cellIndex];
                        return;
                    }
                    //TODO:Validation
                    this.isChoosing = false;
                }
                else {
                    if (this.playerTurn != cellInfo[0]) {
                        return;
                    }
                    this.chosen = [lineIndex, cellIndex];
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
            return this.boardWithChickenOnly[lineIndex][cellIndex] == '-';
        },
        nextPlayer() {
            this.playerTurn = this.playerTurn * 1 + 1;
            if (this.playerTurn == this.playerCount) this.playerTurn = 0;
        }
    }
});
app.mount('#app');