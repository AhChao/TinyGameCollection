const app = Vue.createApp({
    created() { },
    data() {
        return {
            playerTurn: "1",
            boardArray: [],
            playerCount: 2, // 2-4, 3-3, 4-2
            playerScore: [0, 0],
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
            this.drawField();
            this.playerCount = 2;//TODO:fix as 2 for now, max should support 4
            this.playerScore = [0, 0];

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
                for (let j = 0; (i % 2 == 1 ? j < 8 : j < 7); j++) {
                    this.boardArray[i].push(wormOrder.pop());
                }
            }
            console.log(this.boardArray);
        }
    }
});
app.mount('#app');