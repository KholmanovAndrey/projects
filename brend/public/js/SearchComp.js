Vue.component('search', {
    data(){
        return {
            userSearch: '',
        }
    },
    template: `<form class="form" action="#" @submit.parent="$parent.$refs.products.filter">
                    <div class="browse-box">
                        <a class="browse">Browse <i class="fa fa-caret-down "></i></a>
                        <div class="drop">
                            <div class="drop-flex">
                                <h3 class="drop-h3">Women</h3>
                                <ul class="drop-ul">
                                    <li><a href="product.html" class="drop-link">Dresses</a></li>
                                    <li><a href="product.html" class="drop-link">Tops</a></li>
                                    <li><a href="product.html" class="drop-link">Sweaters/Knits</a></li>
                                    <li><a href="product.html" class="drop-link">Jackets/Coats</a></li>
                                    <li><a href="product.html" class="drop-link">Blazers</a></li>
                                    <li><a href="product.html" class="drop-link">Denim</a></li>
                                </ul>
                                <h3 class="drop-h3">Man</h3>
                                <ul class="drop-ul">
                                    <li><a href="product.html" class="drop-link">Leggings/Pants</a></li>
                                    <li><a href="product.html" class="drop-link">Skirts/Shorts</a></li>
                                    <li><a href="product.html" class="drop-link">Accessories</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <input type="text" class="search" v-model="userSearch" placeholder="Search for Item...">
                    <button type="submit" class="search-button"><i class="fa fa-search"></i></button> 
                </form>`
});

