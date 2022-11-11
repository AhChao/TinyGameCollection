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
        };
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        init() {
            rollForSheeps();
            this.lastStepChessboard = [];
            this.validCell = [];
            this.isChoosing = false;
            this.playerTurn = "A";
            this.drawField();
        },
        rollForSheeps() {

        }
    }
});
app.mount('#app');