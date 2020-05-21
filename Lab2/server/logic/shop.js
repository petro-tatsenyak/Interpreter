var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ConcreteComponent = /** @class */ (function () {
    function ConcreteComponent() {
    }
    ConcreteComponent.prototype.operation = function (item, level, price) {
        if (level === void 0) { level = 1; }
        if (price === void 0) { price = 1000; }
        return item;
    };
    ConcreteComponent.prototype.buyComponent = function (item) {
        return item;
    };
    return ConcreteComponent;
}());
var Decorator = /** @class */ (function () {
    function Decorator(component) {
        this.component = component;
    }
    Decorator.prototype.operation = function (item, level, price) {
        if (level === void 0) { level = 1; }
        if (price === void 0) { price = 1000; }
        return this.component.operation(item, level, price);
    };
    Decorator.prototype.buyComponent = function (item) {
        return this.component.buyComponent(item);
    };
    return Decorator;
}());
var CarComponent = /** @class */ (function (_super) {
    __extends(CarComponent, _super);
    function CarComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CarComponent.prototype.operation = function (item, level, price) {
        if (level === void 0) { level = 1; }
        if (price === void 0) { price = 1000; }
        this.shopComponent = _super.prototype.operation.call(this, item, level, price);
        this.shopComponent = {
            group: "component",
            component: item["component"],
            price: price,
            level: level,
            allowed: true
        };
        return this.shopComponent;
    };
    CarComponent.prototype.buyComponent = function (item) {
        if (item["allowed"])
            this.seller = new BuyAllowedComponent();
        else
            this.seller = new BuyClosedComponent();
        this.seller.setComponent(item["component"]);
        return this.seller.buyComponent(item["component"]);
    };
    return CarComponent;
}(Decorator));
var Boost = /** @class */ (function (_super) {
    __extends(Boost, _super);
    function Boost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boost.prototype.operation = function (item) {
        var boost = _super.prototype.operation.call(this, item);
        return {
            group: "boost",
            component: item["component"],
            price: item["speed"],
            level: 1,
            allowed: true
        };
    };
    Boost.prototype.buyComponent = function (item) {
        this.seller = new BuyAllowedComponent();
        this.seller.setComponent(item);
        return this.seller.buyComponent(item);
    };
    return Boost;
}(Decorator));
var Seller = /** @class */ (function () {
    function Seller() {
    }
    Seller.prototype.setComponent = function (context) {
        this.context = context;
    };
    return Seller;
}());
var BuyAllowedComponent = /** @class */ (function (_super) {
    __extends(BuyAllowedComponent, _super);
    function BuyAllowedComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuyAllowedComponent.prototype.buyComponent = function (item) {
        return item;
    };
    return BuyAllowedComponent;
}(Seller));
var BuyClosedComponent = /** @class */ (function (_super) {
    __extends(BuyClosedComponent, _super);
    function BuyClosedComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BuyClosedComponent.prototype.buyComponent = function () {
        return false;
    };
    return BuyClosedComponent;
}(Seller));
module.exports.ConcreteComponent = ConcreteComponent;
module.exports.CarComponent = CarComponent;
module.exports.Boost = Boost;
function clientCode(component, item, level, price) {
    console.log("RESULT: " + JSON.stringify(component.operation(item, level, price)));
    console.log("Buy item " + JSON.stringify(component.buyComponent(component.operation(item, level, price))));
}
var simple = new ConcreteComponent();
console.log('');
var decorator1 = new CarComponent(simple);
console.log('Client: I\'ve got a simple component:');
clientCode(decorator1, { group: "component", component: { speed: 300, type: "wheels" } }, 10, 350);
var decorator2 = new Boost(decorator1);
console.log('Client: Now I\'ve got a decorated component:');
clientCode(decorator2, { group: "boost", component: { speed: 50, type: "superBoost" } });
