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
            return this.chessboard[lineIndex, cellIndex];
        },
        selectCell(lineIndex, cellIndex) {
            let selectedCell = "";
            if (lineIndex < 0) {
                if (lineIndex == -1) selectedCell = this.waitingPlaceW[cellIndex];
                if (lineIndex == -2) selectedCell = this.waitingPlaceB[cellIndex];
            }
            else selectedCell = this.getPosInfo(lineIndex, cellIndex);
            if (selectedCell[0] != this.playerTurn) return;
            this.isChoosing = true;
            this.chosen = [lineIndex, cellIndex];

        }
    }
});
app.mount('#app');