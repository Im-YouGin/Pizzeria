import {getCartSum} from './cardTools.js'
// import {CartManager} from './cartProdTools.js'
import {cartProdSection, pageCont, calcTotalCost} from './app.js'
import {products} from './dbapi.js'




class ProductCard{
    constructor({title, features, desc, price, imgPath}, ProdsManager){

        this.existing = localStorage.getItem('cart');
        this.existing = this.existing ? JSON.parse(this.existing) : {};

        this.title = title;
        this.imgPath = imgPath;
        this.desc = desc;
        this.features = features;
        this.price = price;
        this.el = null;
        this.ProdsManager = ProdsManager;
        this.key = this.title + ',' + features.replace(', ', ',');
        this.quantity = this.existing[this.key]
      
        
    }

    getElement(){
        const tpl = this.getTemplate();
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = tpl.replace('{{imgPath}}', this.imgPath).replace('{{toppings}}', this.desc).replace('{{features}}', this.features).replace('{{title}}', this.title).replace('{{price}}', Number((this.price * this.existing[this.key]).toFixed(3))).replace('{{quantity}}', this.quantity);
        this.el = tmpDiv.children[0];
        this.attachEventListeners();
        return this.el;

    }

    getTemplate(){
        return (
            `
            <div class="cart-container__item">
                <div class="cart-container__remove"><i class="far fa-times-circle remove-cart-item"></i></div>
                <div class="cart-container__prod-d">
                    <div class="cart-container__p-image"><img src="{{imgPath}}" alt=""></div>
                    <div class="cart-container__p-desc">
                        <div class="cart-container__p-title">{{title}}</div>
                        <p class="cart-container__p-toppings">{{toppings}}</p>
                        <p class="cart-container__p-features">{{features}}</p>
                        <div class="cart-container__p-desc-f">
                            <p class="cart-container__price">{{price}}<span class="cart-container__currency">uah</span></p>
                            <div class="quantity-selector">
                                <i class="fas fa-minus minusbtn"></i>
                                <span class="prod-quantity">{{quantity}}</span>
                                <i class="fas fa-plus plusbtn"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>             
            `
        )

    }

    attachEventListeners() {
        const minBtn = this.el.querySelector('.minusbtn');
        minBtn.onclick = () => {
            this.existing = localStorage.getItem('cart');
            this.existing = this.existing ? JSON.parse(this.existing) : {};

            var currN = this.existing[this.key]
            if (currN > 0) {
                currN = currN - 1
            }
            else {
                currN = 0
            }
            this.existing[this.key] = currN;
            this.el.querySelector('.prod-quantity').innerHTML = currN

            localStorage.setItem('cart', JSON.stringify(this.existing));
            document.querySelector('.shopping-cart-number').innerHTML = getCartSum(this.existing);
            this.el.querySelector('.cart-container__price').innerHTML = Number((parseFloat(this.price) * currN).toFixed(3)).toString() + '<span class="cart-container__currency">uah</span>';
            var totalCost = calcTotalCost(this.existing);
            document.querySelector('.cart-total-cost').innerHTML = 'Total cost: ' + Number(totalCost.toFixed(3)).toString()

        }

        const plBtn = this.el.querySelector('.plusbtn');
        plBtn.onclick = () => {
            this.existing = localStorage.getItem('cart');
            this.existing = this.existing ? JSON.parse(this.existing) : {};

            var currN = this.existing[this.key]

            currN = currN + 1

            this.existing[this.key] = currN;
            localStorage.setItem('cart', JSON.stringify(this.existing));

            this.el.querySelector('.prod-quantity').innerHTML = currN

            this.el.querySelector('.cart-container__price').innerHTML = Number((parseFloat(this.price) * currN).toFixed(3)).toString() + '<span class="cart-container__currency">uah</span>';
            document.querySelector('.shopping-cart-number').innerHTML = getCartSum(this.existing);
            var totalCost = calcTotalCost(this.existing);
            document.querySelector('.cart-total-cost').innerHTML = 'Total cost: ' + Number(totalCost.toFixed(3)).toString()
        }

        const removeBtn = this.el.querySelector('.remove-cart-item');
        removeBtn.onclick = () => {
            this.el.innerHTML = '';
            delete this.existing[this.key]

            localStorage.setItem('cart', JSON.stringify(this.existing));
            

            

            pageCont.innerHTML = cartProdSection;
            this.existing = localStorage.getItem('cart');
            this.existing = this.existing ? JSON.parse(this.existing) : {};

            var totalCost = calcTotalCost(this.existing);
            document.querySelector('.cart-total-cost').innerHTML = 'Total cost: ' + Number(totalCost.toFixed(3)).toString()
            document.querySelector('.shopping-cart-number').innerHTML = getCartSum(this.existing);

            var cartProds = [];
            for (var key in this.existing) {
                // check if the property/key is defined in the object itself, not in parent
                if (this.existing.hasOwnProperty(key)) {
                    var t = key.split(',')[0]
                    var features = key.split(',').slice(1).join(', ')           
                    var pr = products.filter((prod) => {return prod['title'] == t})[0];
                    pr['features'] = features;
                    pr['quatity'] = this.existing[key];
                    cartProds.push(pr);
                }
            }

            if (cartProds.length > 0) {
                const tmpManager = new CartManager({
                    el: window.document.querySelector('.cart-container__body'),
                    products: cartProds,
                })
            }
            else {
               pageCont.innerHTML = (
                `
                <div class="cart-container">
                    <div class="cart-title">Your Cart is Empty</div>
                
                </div>
                `
               )
            }
            
            
        }

    }
}

export class CartManager{
    constructor({el, products}){
        this.el = el;
        this.prods = products.map(prod => new ProductCard(prod, this));
        this.renderProds();
    }

    renderProds(){
        this.el.innerHTML = '';
        this.prods.forEach(prod => {
            this.renderProd(prod.getElement());
        });
    }

    renderProd(prodEl){
        this.el.appendChild(prodEl);
    }
}
