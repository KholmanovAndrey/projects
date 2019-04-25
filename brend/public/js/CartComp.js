Vue.component('cart', {
    data(){
        return {
            cartItems: [],
            amount: 0,
            countGoods: 0,
        }
    },
    methods: {
        addProduct(product, addQuantity = false){
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: find.quantity})
                    .then(data => {
                        if(data.result){
                            if (addQuantity) {
                                this.totalPrice();
                                this.totalNumber();
                            } else {
                                find.quantity++;
                                this.amount += find.price;
                                this.countGoods++;
                            }
                        }
                    })
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result){
                            this.cartItems.push(prod);
                            this.totalPrice();
                            this.totalNumber();
                        }
                    })
            }
        },
        remove(product){
            if(product.quantity > 1){
                this.$parent.putJson(`/api/cart/${product.id_product}`, {quantity: -1})
                    .then(data => {
                        if(data.result){
                            product.quantity--;
                            this.totalPrice();
                            this.totalNumber();
                        }
                    })
            } else {
                this.$parent.deleteJson(`/api/cart/${product.id_product}`)
                    .then(data => {
                        if(data.result){
                            this.cartItems.splice(this.cartItems.indexOf(product), 1);
                            this.totalPrice();
                            this.totalNumber();
                        }
                    })
            }
        },
        clear(){
            this.$parent.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if(data.result){
                        this.cartItems = [];
                        this.amount = 0;
                        this.countGoods = 0;
                    }
                })
        },
        totalPrice(){
            this.amount = 0;
            for(let item of this.cartItems){
                this.amount += item.price * item.quantity;
            }
        },
        totalNumber(){
            this.countGoods = 0;
            for(let item of this.cartItems){
                this.countGoods += +item.quantity;
            }
        }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
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
                    <p class="header-cart-total">TOTAL<span>\${{ amount }}</span></p>
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
                    <a class="header-cart-product-link" href="single.html">{{ cartItem.product_name }}</a>
                    <p class="rating">
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star"></i></a>
                        <a href="#" class="rating-star"><i class="fa fa-star-half-o"></i></a>
                    </p>
                    <p class="pink">{{ cartItem.quantity }}  x   \${{ cartItem.quantity * cartItem.price }}</p>
                </div>
                <div class="header-cart-product-column"><a class="cart-delete" @click="$emit('remove', cartItem)"><i class="fa fa-times-circle"></i></a></div>
            </div>`
});

Vue.component('cart-big', {
    props: ['refs'],
    template: `
        <div class="carts">
            <div class="container">
                <div class="carts-box">
                    <div class="cart">
                        <div class="cart-row">
                            <div class="cart-column cart-column-two cart-column-title">Product Details</div>
                            <div class="cart-column cart-column-title">unite Price</div>
                            <div class="cart-column cart-column-title">Quantity</div>
                            <div class="cart-column cart-column-title">shipping</div>
                            <div class="cart-column cart-column-title">Subtotal</div>
                            <div class="cart-column cart-column-title">ACTION</div>
                        </div>
                        <cart-big-item
                        v-for="product of refs.cart.cartItems"  
                        :key="product.id_product"
                        :cart-item="product"></cart-big-item>
                    </div>
                    <div class="cart-button">
                        <a href="#" @click.prevent="$root.$refs.cart.clear" class="cart-button-link">cLEAR SHOPPING CART</a>
                        <a href="#" class="cart-button-link">cONTINUE sHOPPING</a></div>
                </div>
                <form action="#" class="order">
                    <div class="order-box">
                        <h2 class="order-h2">Shipping Adress</h2>
                        <select name="country" class="order-select">
                            <option value="Bangladesh">Bangladesh</option>
                        </select>
                        <input type="text" class="order-input" placeholder="State">
                        <input type="text" class="order-input" placeholder="Postcode / Zip">
                        <button type="submit" class="order-button">get a quote</button>
                    </div>
                    <div class="order-box">
                        <h2 class="order-h2">coupon  discount</h2>
                        <p class="order-p">Enter your coupon code if you have one</p>
                        <input type="text" class="order-input" placeholder="State">
                        <button type="submit" class="order-button">Apply coupon</button>
                    </div>
                    <div class="order-box">
                        <div class="order-box-bg">
                            <p class="order-p">Sub total &nbsp;&nbsp;&nbsp; \${{ refs.cart.amount }}</p>
                            <p class="order-p2">GRAND TOTAL &nbsp;&nbsp; &nbsp;<span class="order-p2-span">\${{ refs.cart.amount }}</span></p>
                            <button type="submit" class="order-button2">proceed to checkout</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        `
});

Vue.component('cart-big-item', {
    props: ['cartItem'],
    template: `
        <div class="cart-row">
            <div class="cart-column cart-column-two">
                <div class="cart-image"><img class="cart-image-img" :src="cartItem.img" alt="product 1"></div>
                <div class="cart-desc">
                    <a class="cart-link" href="single.html">{{ cartItem.product_name }}</a>
                    <p class="cart-text"><span class="cart-text-span">Color:</span> Red</p>
                    <p class="cart-text"><span class="cart-text-span">Size:</span> Xll</p>
                </div>
            </div>
            <div class="cart-column">\${{ cartItem.price }}</div>
            <div class="cart-column">
                <input type="number" min="1" max="20" name="quantity" v-model="cartItem.quantity"
                    @change="$root.$refs.cart.addProduct(cartItem, true)" class="cart-input">
            </div>
            <div class="cart-column">FREE</div>
            <div class="cart-column">\${{ cartItem.quantity*cartItem.price }}</div>
            <div class="cart-column"><a href="#" class="cart-delete" 
                @click.prevent="$root.$refs.cart.remove(cartItem)"><i class="fa fa-times-circle"></i></a></div>
        </div>
        `
});
