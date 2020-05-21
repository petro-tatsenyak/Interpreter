const ShopModel = require('../models/shop-model');
const Shop = require('../logic/shop');
const ComponentModel = require('../models/component-model')

class ShopControl {
    constructor() {
        this.createItem = (req, res) => {
            let body = req.body

            if (!body) {
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a Component',
                })
            }
            const simple = new Shop.ConcreteComponent();
            if(req.body.group == "component"){
                const item = new Shop.CarComponent(simple);
                body = item.operation(req.body.component, req.body.level, req.body.price)
            }
            else{
                const item = new Shop.Boost(simple);
                body = item.operation(req.body.component)
            }
            console.log(body)
            const component = new ShopModel(body)

            if (!component) {
                return res.status(400).json({ success: false, error: err })
            }

            component
                .save()
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        id: component._id,
                        message: 'Component created!',
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Component not created!',
                    })
                })
        } 

        this.getItem = async (req, res) => {
            await ShopModel.findOne({ _id: req.params.id, group: req.params.group }, async (err, component) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!component) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Component not found` })
                }
                else{
                    const simple = new Shop.ConcreteComponent();
                    let item = false;
                    if(req.params.group == "component"){
                        item = new Shop.CarComponent(simple);
                    }   
                    if(req.params.group == "boost"){
                        item = new Shop.Boost(simple);
                    }
                    const boughtItem = item.buyComponent(item.operation(component, component.level, component.price))
                    console.log(boughtItem)
                    const componentModel = new ComponentModel(boughtItem)
                    if (!componentModel) {
                        return res.status(400).json({ success: false, error: err })
                    }
                    componentModel.save()
                    await ShopModel.deleteOne({  _id: req.params.id }, function (err) {
                        if (err) return handleError(err);
                    });
                }
                
                return res.status(200).json({ success: true, data: component })
            }).catch(err => console.log(err))
        }
    }
}

module.exports = new ShopControl();