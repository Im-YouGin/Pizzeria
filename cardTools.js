// if (localStorage.getItem("cart") === null) {
//     localStorage.setItem("cart", JSON.stringify({}));
// }

export function getCartSum(obj) {
    var sum = 0;
    for( var el in obj ) {
        if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
        }
    }
    return sum;
}

export class ProductCard{
    constructor({title, desc, price, weight, imgPath, prodUrl}, ProdsManager){
        this.title = title;
        this.desc = desc;
        this.price = price;
        this.weight = weight;
        this.imgPath = imgPath;
        this.prodUrl = prodUrl;

        this.el = null;
        this.ProdsManager = ProdsManager;
    }

    getElement(){
        const tpl = this.getTemplate();
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = tpl.replace('{{imgPath}}', this.imgPath).replace('{{weight}}', this.weight).replace('{{prodUrl}}', this.prodUrl).replace('{{title}}', this.title).replace('{{desc}}', this.desc).replace('{{price}}', this.price).replace('{{href}}', window.location.href.split('#')[1]);
        
        this.el = tmpDiv.children[0];
        // console.log(this.el)
        this.attachEventListeners();
        return this.el;

    }

    getTemplate(){
        return `
        <div class="product-list__item">
            <div class="product-block">
                <div class="product-block__image">
                    <div class="product-image">
                        <img src="{{imgPath}}" alt="">
                    </div>
                    <div class="product-block__weight">{{weight}}</div>
                </div>
                <div class="product-block__description">
                    <div class="product-block__title-row">
                        <a href="#{{prodUrl}}" class="product-block__title-text">{{title}}</a>
                    </div>
                    <div class="product-block__toppings-row">
                        <span>{{desc}}</span>
                    </div>
                    <div class="product-block__details">
                        <div class="product-block__details-col">
                            <div class="product-block__button-block">
                                <button type="button" alt="Small" class="product-block__button">Small</button>
                                <button type="button" alt="Medium" class="product-block__button product-block__button-active">Medium</button>
                                <button type="button" alt="Large" class="product-block__button">Large</button>
                            </div>
                        </div>
                        <div class="product-block__details-col">
                            <div class="product-block__flavor btn-grid">
                                <button type="button" alt="Standard" class="product-block__button product-block__button-active">Standard</button>
                                <button type="button" alt="Thin" class="product-block__button">Thin</button>
                                <button type="button" alt="Filadelfia" class="product-block__button">Filadelfia</button>
                                <button type="button" alt="Hot-dog" class="product-block__button">Hot-dog</button>
                            </div>
                        </div>
                    </div>
                        
                    <div class="product-block__price-row">
                        <div class="product-block__price-block">
                            <span class="product-block__price">{{price}}</span>
                            <span class="product-block__currency">Uah</span>
                        </div>
                        <a href="#{{href}}" class="to-cart-btn">Add to Cart</a>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    attachEventListeners(){
        // CHOOSE PIZZA SIZE
        const sizeBtnCont = this.el.querySelector(".product-block__button-block");
        var sizeBtns = this.el.querySelectorAll(".product-block__button-block .product-block__button");
        sizeBtnCont.onclick = function (event) {
            event.preventDefault();
            const element = event.target;

            if (element.nodeName === 'BUTTON') {
                [].forEach.call(sizeBtns, function(el) {
                    el.classList.remove("product-block__button-active");
                });
                element['classList'].add('product-block__button-active')
            }
        }

        // CHOOSE PIZZA FEATURES
        const flavorBtnCont = this.el.querySelector(".product-block__flavor");
        var flavorBtns = this.el.querySelectorAll(".product-block__flavor .product-block__button");
        flavorBtnCont.onclick = function (event) {
            event.preventDefault();
            const element = event.target;

            if (element.nodeName === 'BUTTON') {
                [].forEach.call(flavorBtns, function(el) {
                    el.classList.remove("product-block__button-active");
                });
                element['classList'].add('product-block__button-active')
            }
        }

        // ADD TO CART CLICK
        const addToCart = this.el.querySelector(".to-cart-btn");
        addToCart.onclick = () => {
            var features = [];
            var btns = this.el.querySelectorAll('.product-block__button');
            for (var i = 0; i < btns.length; ++i) {
                if (btns[i]['classList'].contains('product-block__button-active')) {
                    features.push(btns[i].getAttribute('alt'))
                };
            }
            features = features.join(',')
            var existing = localStorage.getItem('cart');
            existing = existing ? JSON.parse(existing) : {};
            var k = this.title + ',' + features
            if (k in existing) {
                existing[k] += 1;
            }
            else {
                existing[k] = 1;
            }
           
            localStorage.setItem('cart', JSON.stringify(existing));
            document.querySelector('.shopping-cart-number').innerHTML = getCartSum(existing);
        }

       
    }
}

export class ProductsManager{
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



