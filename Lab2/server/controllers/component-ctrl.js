
const Component = require('../models/component-model')

const CarModel = require('../models/car-model');

const UserModel = require('../models/user-model')

const Car = require("../logic/car")

let componentsList = {
    engine: "empty",
    wheels: "empty",
    wing: "empty"
} 

const buildCar = async (director) => {
    const builder = Car.CarBuilder;
    let userName = "" 
    let userTitle = "" 

    await UserModel.findOne({ }, (err, user) =>{
        userName = user["name"]?user["name"]:"User";
        userTitle = user["title"]?user["title"]:"Default";
        console.log(`name ${userName}, title ${userTitle}`)
    })

    await CarModel.countDocuments(async (err, count) => {
        if (!err && count === 0) {
            
            director.setBuilder(builder);
            director.buildFullFeaturedProduct(componentsList.engine, componentsList.wheels, componentsList.wing);
            car = builder.getProduct().listParts()
            car.name = userName?userName:car.name
            car.title = userTitle?userTitle:car.title
            const carModel = new CarModel(car);
            carModel.save()
                .then(() => console.log("car created"))
                .catch(err => console.log(err))
        }
        if(!err && count > 0){
            await CarModel.findOne({  }, (err, carModel) =>{
                componentsList.engine = componentsList.engine == "empty"?carModel.engine:componentsList.engine
                componentsList.wheels = componentsList.wheels == "empty"?carModel.wheels:componentsList.wheels
                componentsList.wing = componentsList.wing == "empty"?carModel.wing:componentsList.wing
                carModel.engine = componentsList.engine
                carModel.wheels = componentsList.wheels
                carModel.wing = componentsList.wing
                carModel.save()
                    .then(() => console.log("car updated"))
                    .catch(err => console.log(err))
            })
        }
    });



    return componentsList
}

class ComponentControl {
    constructor() {
        
        this.createComponent = (req, res) => {
                const body = req.body

                if (!body) {
                    return res.status(400).json({
                        success: false,
                        error: 'You must provide a Component',
                    })
                }

                const component = new Component(body)

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

        this.getComponentById = async (req, res) => {
           await Component.findOne({ _id: req.params.id, type: req.params.type }, (err, component) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!component) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Component not found` })
                }
                componentsList[req.params.type] = {
                    id: component._id,
                    type: component.type,
                    speed: component.speed
                }
                return res.status(200).json({ success: true, data: component })
            }).catch(err => console.log(err))
        }

        this.setCar = async (req, res) => {
            await Component.find({},async (err, components) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!components.length) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Component not found` })
                }
                const Director = new Car.Director();
                await buildCar(Director)
                return res.status(200).json({ success: true, data: componentsList })
            }).catch(err => console.log(err))
        }

        this.setTitle = async (req, res) => {        
            await UserModel.findOne({}, (err, user) =>{
                if (err) {
                    return false
                }
                if (!user) {
                    return false
                }
                user.title = req.body.title
                user.save()
                .then(console.log("changed" + JSON.stringify(user)))
                .catch(err => console.log(err))
            })

            await CarModel.findOne({}, (err, carModel) =>{
                if (err) {
                    return false
                }
                if (!carModel) {
                    return false
                }
                carModel.title = req.body.title
                carModel.save()
                .then(console.log("changed" + JSON.stringify(carModel)))
                .catch(err => console.log(err))
            })

            return res.status(200).json({ success: true, data: {title: req.body.title} })
        }

        this.getCar = async (req, res) => {
            await CarModel.findOne({ name: "User"}, (err, carModel) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!carModel) {
                    return res
                        .status(404)
                        .json({ success: false, error: `carModel not found` })
                }
                return res.status(200).json({ success: true, data: carModel })
            }).catch(err => console.log(err))
        }
    }

}

module.exports = new ComponentControl();