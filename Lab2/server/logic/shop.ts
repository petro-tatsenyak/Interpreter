interface Component {
    operation(item: Object, level?: number, price?: number): Object;
    buyComponent(item: Object): Object;
}

class ConcreteComponent implements Component {
    public operation(item: Object, level: number = 1, price: number = 1000): Object {
        return item;
    }

    public buyComponent(item): Object {
        return item;
    }
}

class Decorator implements Component {
    protected component: Component;

    constructor(component: Component) {
        this.component = component;
    }

    public operation(item: Object, level: number = 1, price: number = 1000): Object {
        return this.component.operation(item, level, price);
    }

    public buyComponent(item: Object): Object {
        return this.component.buyComponent(item);
    }
}

class CarComponent extends Decorator {
    private shopComponent: Object;
    private seller: Seller

    public operation(item: Object, level: number = 1, price: number = 1000): Object {
        this.shopComponent = super.operation(item, level, price)
        this.shopComponent = {
            group: "component",
            component: item["component"],
            price: price,
            level: level,
            allowed: true
        };
        return this.shopComponent
    }

    public buyComponent(item: Object): Object {
        if(item["allowed"])
            this.seller = new BuyAllowedComponent()
        else
            this.seller = new BuyClosedComponent() 
        this.seller.setComponent(item["component"])
        return this.seller.buyComponent(item["component"])   
    }
}

class Boost extends Decorator {
    private seller: Seller

    public operation(item: Object): Object {
        let boost = super.operation(item)
        return {
            group: "boost",
            component: item["component"],
            price: item["speed"],
            level: 1,
            allowed: true
        };
    }

    public buyComponent(item: Object): Object {
        this.seller = new BuyAllowedComponent()
        this.seller.setComponent(item)
        return this.seller.buyComponent(item)   
    }
}

abstract class Seller {
    protected context: Object;

    public setComponent(context: Object) {
        this.context = context;
    }

    public abstract buyComponent(item: Object): any;
}

class BuyAllowedComponent extends Seller {
    public buyComponent(item: Object) {
        return item;
    }

}

class BuyClosedComponent extends Seller {
    public buyComponent() {
        return false;
    }
}


module.exports.ConcreteComponent = ConcreteComponent;
module.exports.CarComponent = CarComponent;
module.exports.Boost = Boost;

function clientCode(component: Component, item: Object, level?: number, price?: number) {
    console.log(`RESULT: ${JSON.stringify(component.operation(item, level, price))}`);

    console.log(`Buy item ${JSON.stringify(component.buyComponent(component.operation(item, level, price)))}`)
}



const simple = new ConcreteComponent();

console.log('');

const decorator1 = new CarComponent(simple);
console.log('Client: I\'ve got a simple component:');
clientCode(decorator1, { group: "component", component: {speed: 300, type: "wheels"} }, 10, 350);
const decorator2 = new Boost(decorator1);
console.log('Client: Now I\'ve got a decorated component:');
clientCode(decorator2, {group: "boost", component: {speed: 50,  type: "superBoost"} });