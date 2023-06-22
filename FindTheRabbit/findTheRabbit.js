const app = Vue.createApp({
    created() { },
    data() {
        return {
            playerCount: 2,
            questionMax: 15,
            questionContent: [],
            questionAnswer: "",
            phase: "setup",
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.phase = "setup";
            this.playerCount = 2;
            this.questionMax = 15;
        },
        setupOk() {
            this.phase = "game";
        },
        WonTheGameBy(name) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            document.getElementById("snackbar").innerText = "Player " + chessOwner + " Won The Game!";
        }
    }
});
app.mount('#app');