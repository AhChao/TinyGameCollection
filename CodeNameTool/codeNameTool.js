const app = Vue.createApp({
    created() { },
    data() {
        return {
            array: [],
            blueGoFirst: false,
            size:30,
        };
    },
    mounted() {
        this.init();
    },
    computed: {
    },
    methods: {
        init() {
            this.array = this.generateRandomArray(5, 5);
            this.array.forEach(row => console.log(row.join(" ")));
            console.log(this.array);
        },
        modifySize(amount){
            this.size += amount;
        },
        generateRandomArray(rows, cols) {
            const totalCells = rows * cols;
            console.log(totalCells);
            this.blueGoFirst = Math.random() < 0.5;
            const contentCounts = {
                "Blue": this.blueGoFirst ? 9 : 8,
                "Red": this.blueGoFirst ? 8 : 9,
                "Black": 1,
                "Bisque": 7
            };
        
            let remainingContent = [];
            for (let content in contentCounts) {
                for (let i = 0; i < contentCounts[content]; i++) {
                    remainingContent.push(content);
                }
            }
        
            let result = [];
            for (let i = 0; i < rows; i++) {
                let row = [];
                for (let j = 0; j < cols; j++) {
                    let randomIndex = Math.floor(Math.random() * remainingContent.length);
                    let randomContent = remainingContent.splice(randomIndex, 1)[0];
                    row.push(randomContent);
                }
                result.push(row);
            }
        
            return result;
        }
    }
});
app.mount('#app');