import {products, indexes} from './dbapi.js'

var classicPizzaInd = indexes['classic'];
var premiumPizzaInd = indexes['premium'];
var legendPizzaInd = indexes['legend'];
var customPizzaInd = indexes['custom'];
var bestPriceInd = indexes['bestPrice'];
var recommendedInd = indexes['recommended'];

export var bestPriceProds = bestPriceInd.map(i => {return products[i]});
export var recommendedProds = recommendedInd.map(i => {return products[i]});
export var classicPizzaProds = classicPizzaInd.map(i => {return products[i]});
export var premiumPizzaProds = premiumPizzaInd.map(i => {return products[i]});
export var legendPizzaProds = legendPizzaInd.map(i => {return products[i]});
export var customPizzaProds = customPizzaInd.map(i => {return products[i]});




