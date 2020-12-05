export function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

export var products = JSON.parse(Get('https://my-json-server.typicode.com/Im-YouGin/Pizzeria/products'));

export var indexes = JSON.parse(Get('https://my-json-server.typicode.com/Im-YouGin/Pizzeria/indexes'));
