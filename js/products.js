
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

import pagination from './pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'carolli_apexc';

let productsModal = {}; //建議寫在外面可直接呼叫
let delProductModal = {};

const app = createApp({
    components:{
        pagination
    },
    data(){
        return{
            temp: {
                // 多圖(array)
                imagesUrl: [],
            },
            products: [],
            // 判斷 updateProduct 跑編輯還是新增
            isNew: false,
            pagination:{}
        }
    },
    methods:{
        // 確認是否有登入
        checkLogin(){
            axios.post(`${apiUrl}/api/user/check`)
            .then((res)=>{
                // console.log(res);
                // 成功就執行取得資料
                this.getData();
            })
            .catch((err)=>{
                console.dir(err);
                // 錯誤跳出通知
                alert(err.data.message);
            })
        },
        getData(page = 1){ // 參數預設值
            // query 用 ? 去帶參數
            // param 
            axios.get(`${apiUrl}/api/${apiPath}/admin/products/?page=${page}`)
            .then(res=>{
                console.log(res.data.products);
                // 成功新增 data 到 products
                this.products = res.data.products;
                this.pagination = res.data.pagination;
            }).catch(err=>{
                // 錯誤跳出通知
                console.dir(err);
                alert(err.data.message);
            })
        },
        showProduct(item){
            this.temp = item;
        },
        openModal(status, product){
            console.log(status, product);
            if( status === 'isNew'){ // 新增產品，temp 等於空的
                this.temp = {
                    imagesUrl: [],
                };
                productsModal.show();
                this.isNew = true;
            }else if(status === 'edit'){ // 編輯產品，temp 就是該產品
                this.temp = { ...product };
                productsModal.show();
                this.isNew = false;
            }else if(status === 'delete'){ // 刪除產品
                this.temp = { ...product };
                delProductModal.show();
            }
        },
    },
    mounted(){ //當作 init
        // 取出 token，經過驗證之後才會執行 check
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
        console.log(token);
        productsModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
});

// 產品新增、編輯 modal 元件
app.component('productModal',{
    props: ['temp','isNew'],
    template: '#templateForProductModal',
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'carolli_apexc',
        }
    },
    methods: {
        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            if(!this.isNew){ // 如果不是新增產品，把 url 跟 method 做替換
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temp.id}`;
                method = 'put';
            }
            // 因為所有資料都要在 data 裡，所以要用 data 帶剛剛新增產品的資料
            axios[method](url, {data: this.temp})
            .then(res=>{
                // console.log(res);
                // 重新取得產品列表
                // this.getData(); // 屬於外層方法，沒辦法使用
                this.$emit('get-data'); // 改成用 emit 由內往外取得資料
                // 把 modal 關掉
                productsModal.hide();
            }).catch(err=>{
                // 錯誤跳出通知
                console.dir(err);
                alert(err.data.message);
            })
        },
    },
});

app.component('delModal',{
    props: ['temp'],
    template: '#templateForProductDel',
    methods:{
        delProduct(){
            axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${this.temp.id}`)
            .then(res=>{
                console.log(res);
                // 重新取得產品列表
                // this.getData(); // 屬於外層方法，沒辦法使用
                this.$emit('get-data'); // 改成用 emit 由內往外取得資料
                // 把 modal 關掉
                delProductModal.hide();
            }).catch(err=>{
                // 錯誤跳出通知
                console.dir(err);
                alert(err.data.message);
            })
        }
    }
})

app.mount('#app');