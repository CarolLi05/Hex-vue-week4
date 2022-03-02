
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'carolli_apexc';

let productsModal = {}; //建議寫在外面可直接呼叫
let delProductModal = {};

createApp({
    data(){
        return{
            temp: {
                // 多圖(array)
                imagesUrl: [],
            },
            products: [],
            // 判斷 updateProduct 跑編輯還是新增
            isNew: false
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
        getData(){
            axios.get(`${apiUrl}/api/${apiPath}/admin/products`)
            .then(res=>{
                console.log(res.data.products);
                // 成功新增 data 到 products
                this.products = res.data.products;
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
        updateProduct(){
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let method = 'post';
            if(!this.isNew){ // 如果不是新增產品，把 url 跟 method 做替換
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.temp.id}`;
                method = 'put';
            }
            // 因為所有資料都要在 data 裡，所以要用 data 帶剛剛新增產品的資料
            axios[method](url, {data: this.temp})
            .then(res=>{
                console.log(res);
                // 重新取得產品列表
                this.getData();
                // 把 modal 關掉
                productsModal.hide();
            }).catch(err=>{
                // 錯誤跳出通知
                console.dir(err);
                alert(err.data.message);
            })
        },
        delProduct(){
            axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${this.temp.id}`)
            .then(res=>{
                console.log(res);
                // 重新取得產品列表
                this.getData();
                // 把 modal 關掉
                delProductModal.hide();
            }).catch(err=>{
                // 錯誤跳出通知
                console.dir(err);
                alert(err.data.message);
            })
        }
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
}).mount('#app');