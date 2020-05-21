var CarBuilder = /** @class */ (function () {
    function CarBuilder() {
        this.reset();
    }
    CarBuilder.prototype.reset = function () {
        this.product = new Product();
    };
    CarBuilder.getInstance = function () {
        if (!CarBuilder.instance) {
            CarBuilder.instance = new CarBuilder();
        }
        return CarBuilder.instance;
    };
    CarBuilder.prototype.produceEngine = function (component) {
        this.product.parts["engine"] = component;
    };
    CarBuilder.prototype.produceWheels = function (component) {
        this.product.parts["wheels"] = component;
    };
    CarBuilder.prototype.produceWing = function (component) {
        this.product.parts["wing"] = component;
    };
    CarBuilder.prototype.getProduct = function () {
        var result = this.product;
        this.reset();
        return result;
    };
    return CarBuilder;
}());
var Product = /** @class */ (function () {
    function Product() {
        this.parts = {
            name: "User",
            title: "Ferrari",
            engine: {},
            wheels: {},
            wing: {}
        };
    }
    Product.prototype.listParts = function () {
        return this.parts;
    };
    return Product;
}());
var Director = /** @class */ (function () {
    function Director() {
    }
    Director.prototype.setBuilder = function (builder) {
        this.builder = builder;
    };
    Director.prototype.buildMinimalViableProduct = function (component) {
        this.builder.produceEngine(component);
    };
    Director.prototype.buildFullFeaturedProduct = function (engine, wheels, wing) {
        this.builder.produceEngine(engine);
        this.builder.produceWheels(wheels);
        this.builder.produceWing(wing);
    };
    return Director;
}());
module.exports.CarBuilder = CarBuilder.getInstance();
module.exports.Director = Director;
