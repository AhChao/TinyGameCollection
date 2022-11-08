const app = Vue.createApp({
    created() { },
    data() {
        return {
            chessboard: [],
            lastStepChessboard: [],
            chosen: [0, 0],
            isChoosing: false,
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
            this.chosen = [lineIndex, cellIndex];
            this.isChoosing = true;
        }
    }
});
app.mount('#app');