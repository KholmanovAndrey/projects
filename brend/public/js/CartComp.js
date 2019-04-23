Vue.component('cart', {
    data(){
        return {
            cartItems: [],
            amount: 0,
            countGoods: 0,
        }
    },
    methods: {
        addProduct(product){
            this.$parent.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if(data.result){
                        let find = this.cartItems.find(el => el.id_product === product.id_product);
                        if(find){
                            find.quantity++;
                            this.amount += find.price;
                            this.countGoods++;
                        } else {
                            let prod = Object.assign({quantity: 1}, product);
                            this.cartItems.push(prod);
                            this.amount += prod.price;
                            this.countGoods++;
                        }
                    }
                })
        },
        remove(product){
            this.$parent.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if(data.result){
                        if(product.quantity > 1){
                            product.quantity--;
                            this.amount -= product.price;
                            this.countGoods--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(product), 1);
                            this.amount -= product.price;
                            this.countGoods--;
                        }
                    }
                })
        },
    },
    mounted(){
        this.$parent.getJson(`getBasket.json`)
            .then(data => {
                for(let el of data.contents){
                    this.cartItems.push(el);
                }
                this.amount = data.amount;
                this.countGoods = data.countGoods;
            });
    },
   template: `
            <div class="header-cart">
                <a class="header-cart-link"><img class="header-cart-img" src="img/cart.svg" alt="cart"></a>
                <div class="header-cart-drop">
                    <p v-if="!cartItems.length">Cart is empty</p>
                    <cart-item 
                    v-for="product of cartItems"  
                    :key="product.id_product"
                    :cart-item="product"
                    @remove="remove"></cart-item>
                    <p class="header-cart-total">TOTAL<span>\${{amount}}</span></p>
                    <a class="header-cart-checkout" href="checkout.html">Checkout</a>
                    <a class="header-cart-go" href="cart.html">Go to cart</a>
                </div>
            </div>`
});

Vue.component('cart-item', {
    props: ['cartItem'],
    template: `
            <div class="header-cart-product">
                <div class="header-cart-product-column"><img class="header-cart-product-img" :src="cartItem.img" alt="product 1"></div>
                <div class="header-cart-product-column">
                    <a class="header-cart-product-link" href="single.html">{{cartItem.product_name}}</a>
                    <p class="rating">
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star-half-o"></i></a>
                    </p>
                    <p class="pink">{{cartItem.quantity}}  x   \${{cartItem.quantity*cartItem.price}}</p>
                </div>
                <div class="header-cart-product-column"><a class="cart-delete" @click="$emit('remove', cartItem)"><i class="fa fa-times-circle"></i></a></div>
            </div>`
});
