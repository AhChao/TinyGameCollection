const app = Vue.createApp({
    created() { },
    data() {
        return {
            sth: '',
        };
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        init() {
            sth();
        },
    }
});
app.mount('#app');