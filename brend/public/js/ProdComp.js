Vue.component('products', {
    data(){
        return {
            filtered: [],
            products: [],
            countProduct: {
                page: 0,
                count: 0,
                countPage: 0,
            },
        }
    },
    props: ['page', 'count'],
    mounted(){
        this.$parent.getJson(`getProducts.json`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
                this.pagePaginationStart(this.page ? this.page : 0);
            });
    },
    methods: {
        filter(){
            let regexp = new RegExp(this.$root.$refs.search.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        },
        pagePaginationStart(page = 0){
            this.countProduct.page = page;
            this.countProduct.count = this.count ? this.count : this.filtered.length;
            this.countProduct.countPage = Math.ceil(this.filtered.length / this.countProduct.count) - 1;
        },
        pagePaginationClear(){
            this.countProduct.page = 0;
            this.countProduct.count = this.filtered.length;
        },
        pagePaginationNext(){
            if (this.countProduct.countPage > this.countProduct.page) {
                this.countProduct.page++;
            }
        },
        pagePaginationPrev(){
            if (this.countProduct.page) {
                this.countProduct.page--;
            }
        },
    },
    template: `<div class="products-content">
                    <product 
                    v-for="(product, index) in filtered"
                    v-if="index >= (countProduct.page * countProduct.count) && 
                            index < (countProduct.page * countProduct.count + countProduct.count)"
                    :key="product.id_product"
                    :product="product"></product>
                </div>`
});

Vue.component('product', {
    props: ['product'],
    template: `<div class="product" >
                <div class="product-image">
                    <a class="product-img" href="single.html"><img :src="product.img" alt="product 1"></a>
                    <div class="product-cart"><button class="product-cart-a" @click="$root.$refs.cart.addProduct(product)">Add to Cart</button></div>
                </div>
                <a href="single.html" class="product-title">{{ product.product_name }}</a>
                <a href="single.html" class="product-price">\${{ product.price}}</a>
            </div>`
});