import {Get} from './dbapi.js'

class ProductCard{
    constructor({title, desc, imgPath}, ProdsManager){
        this.title = title;
        this.desc = desc;
        this.imgPath = imgPath;

        this.el = null;
        this.ProdsManager = ProdsManager;
    }

    getElement(){
        const tpl = this.getTemplate();
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = tpl.replace('{{imgPath}}', this.imgPath).replace('{{weight}}', this.weight).replace('{{prodUrl}}', this.prodUrl).replace('{{title}}', this.title).replace('{{desc}}', this.desc).replace('{{price}}', this.price);
        this.el = tmpDiv.children[0];
        // this.attachEventListeners();
        return this.el;

    }

    getTemplate(){
        return `
        <div class="action-item">
            <div class="action-info">
                <h1>{{title}}</h1>
                <p>{{desc}}</p>
            </div>
            <div class="action-img">
                <img src="{{imgPath}}" alt="img">
            </div>
        </div>
        `
    }

}

export class ActionsManager{
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

export var actions = JSON.parse(Get('https://my-json-server.typicode.com/Im-YouGin/Pizzeria/actions'));

// exports = {ActionsManager, actions}