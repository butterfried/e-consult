<script>
    import axios from 'axios';
    // import {APIENDPOINT} from  '../../http-common.js';
    // import loginService from './adminService.js';
    export default {
        template: require('./login.html'),
        data() {
            return {
                username: '',
                password: '',
                loginFail: false
            }
        },
        methods: {
            login() {
                let payload = {
                    'username': this.username,
                    'password': this.password
                };
                console.log('login.vue : login method');
                this.$store.dispatch('login', payload)
                    .then(response => {
                            console.log('login.vue : login passed');
                            this.$router.push("/");
                        }, error => {
                            console.log('login.vue : login failed');
                            // console.log(error);
                            this.loginFail = true;
                        }
                    );
            }
        },
        computed: {},
        mounted() {
            this.isMounted = true;
            this.timer1 = setInterval(() => {
                if (this.$store.getters['isLoggedIn']) {
                    this.$router.push("/");
                }
                if (!this.isMounted) {
                    clearInterval(this.timer1);
                }
            }, 500);
        },
        beforeDestroy() {
            console.log('unmounted');
            this.isMounted = false;
        },
    }
</script>

<style lang="scss">
    // @import './login.scss';
</style>
