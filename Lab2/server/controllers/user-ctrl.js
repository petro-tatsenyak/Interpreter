const User = require('../logic/user');
const UserModel = require('../models/user-model')
const CarModel = require('../models/car-model');



class UserControl {
    constructor() {
        this.createUser = async (req, res) => {
            const realUser = new User.User();
            const proxy = new User.ProxyUser(realUser);
            let body = proxy.createUser(req.body)
            await UserModel.countDocuments( async (err, count) => {
                if (!err && count === 0) {   
                    await CarModel.findOne({ }, (err, carModel) =>{
                        if(!carModel)
                            body["title"] = "Default"
                        else{
                            body["title"] = carModel["title"] ||  req.body.title || "Default"
                            carModel.name = req.body.name
                            carModel.save()
                            .then(() => console.log("Car name updated"))
                            .catch(() => console.error("Car name is not updated!"))
                        }
                    })
                    const userModel = new UserModel(body)
                    userModel.save()
                        .then(() => {
                            return res.status(201).json({
                                success: true,
                                id: userModel._id,
                                message: 'Component created!',
                            })
                        })
                        .catch(error => {
                            return res.status(400).json({
                                error,
                                message: 'User not created!',
                            })
                        })
                }
            }); 
        } 

        this.setName = async (req, res) => {
            await UserModel.findOne({}, (err, user) =>{
                if (err) {
                    return false
                }
                if (!user) {
                    return false
                }
                user.name = req.body.name
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
                carModel.name = req.body.name
                carModel.save()
                .then(console.log("changed" + JSON.stringify(carModel)))
                .catch(err => console.log(err))
            })

            return res.status(200).json({ success: true, data: {title: req.body.name} })
        }
    }
}

module.exports = new UserControl();
