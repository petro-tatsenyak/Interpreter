interface Builder {
    produceEngine(component: Object): void;
    produceWheels(component: Object): void;
    produceWing(component: Object): void;
}

class CarBuilder implements Builder {
    private product: Product;
    private static instance: CarBuilder;
    private constructor() {
        this.reset();
    }

    public reset(): void {
        this.product = new Product();
    }

    public static getInstance() {
        if (!CarBuilder.instance) {
            CarBuilder.instance = new CarBuilder();
        }
        return CarBuilder.instance;
    }

    public produceEngine(component: Object): void {
        this.product.parts["engine"] = component;
    }

    public produceWheels(component: Object): void {
        this.product.parts["wheels"] = component;
    }

    public produceWing(component: Object): void {
        this.product.parts["wing"] = component;
    }

    public getProduct(): Product {
        const result = this.product;
        this.reset();
        return result;
    }
}

class Product {
    public parts: Object = {
        name: `User`,
        title: `Ferrari`,
        engine: {},
        wheels: {},
        wing: {}
    };

    public listParts(): Object {
        return this.parts
    }
}

class Director {
    private builder: Builder;

    public setBuilder(builder: Builder): void {
        this.builder = builder;
    }

    public buildMinimalViableProduct(component: Object): void {
        this.builder.produceEngine(component);
    }

    public buildFullFeaturedProduct(engine: Object, wheels: Object, wing: Object): void {
        this.builder.produceEngine(engine);
        this.builder.produceWheels(wheels);
        this.builder.produceWing(wing);
    }
}

module.exports.CarBuilder = CarBuilder.getInstance();
module.exports.Director = Director;