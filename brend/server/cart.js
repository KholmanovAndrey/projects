let totalPrice = (cart) => {
    cart.amount = 0;
    for(let item of cart.contents){
        cart.amount += item.price * item.quantity;
    }
    return cart;
};
let totalNumber = (cart) => {
    cart.countGoods = 0;
    for(let item of cart.contents){
        cart.countGoods += +item.quantity;
    }
    return cart
};

let add = (cart, req) => {
    cart.contents.push(req.body);
    cart = totalPrice(cart);
    cart = totalNumber(cart);
    return {newCart: JSON.stringify(cart, null, 4), name: req.body.product_name};
};
let change = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
    find.quantity += req.body.quantity;
    cart = totalPrice(cart);
    cart = totalNumber(cart);
    return {newCart: JSON.stringify(cart, null, 4), name: find.product_name};
};
let remove = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
    cart.contents.splice(cart.contents.indexOf(find), 1);
    cart = totalPrice(cart);
    cart = totalNumber(cart);
    return {newCart: JSON.stringify(cart, null, 4), name: find.product_name};
};
module.exports = {
    add,
    change,
    remove
};