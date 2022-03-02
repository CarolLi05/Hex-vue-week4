
// Vue 第三週作業


import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'carolli_apexc';

const app = createApp({
    data(){
        return{
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods:{
        login(){ // 發送 API 至遠端並登入（並儲存 Token）
            axios.post(`${url}/admin/signin`, this.user)
            .then((res)=>{
                // console.log(res);
                // console.dir(res.data.token);
                // 寫入 cookie token
                // expires 設置有效時間
                const { token, expired } = res.data;
                console.log(token, expired);
                document.cookie = `loginToken = ${ token }; expires = ${ new Date(expired) }`;
                window.location = './products.html';
            })
            .catch((err)=>{
                alert(err.data.message);
            })
        },
    },
})

app.mount('#app');