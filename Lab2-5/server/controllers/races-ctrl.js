const CarModel = require('../models/car-model');

const UserModel = require('../models/user-model');

const Races = require('../logic/race')

let car = {
    title: "Williams",
    speed: 100
}

class RaceControlFacade {
    constructor(){
        this.mycar = this.mycar || new Car();
        this.race = this.race || new Race();
        this.startSpainRace = async (req, res) => {
            await this.mycar.initCar()
            let result = this.race.race(new Races.RaceSpain(car), "Spain")
            await UserModel.findOne({}, (err, user) =>{
                if (err) {
                    return false
                }
                if (!user) {
                    return false
                }
                user.coins += result.reward
                user.experience += Math.round(result.reward/20)
                user.level = Math.floor(user.experience/100)
                user.save()
                .then(console.log("changed" + JSON.stringify(user)))
                .catch(err => console.log(err))
            })
            return res.status(200).json(result)
        }
        this.startEnglandRace = async (req, res) => {
            await this.mycar.initCar()
            let result = this.race.race(new Races.RaceEngland(car), "England")
            await UserModel.findOne({}, (err, user) =>{
                if (err) {
                    return false
                }
                if (!user) {
                    return false
                }
                user.coins += result.reward
                user.experience += Math.round(result.reward/20)
                user.level = Math.floor(user.experience/100)
                user.save()
                .then(console.log("changed" + JSON.stringify(user)))
                .catch(err => console.log(err))
            })
            return res.status(200).json(result)
        }
    }    
}

class Car {
    constructor() {
        this.initCar = async () => {
            await CarModel.findOne({}, (err, carModel) => {
                if (err) {
                    return car
                }
                if (!carModel) {
                    return car
                }
                car.title = carModel.title
                car.speed = carModel.engine.speed + carModel.wheels.speed + carModel.wing.speed
                return car
            }).catch(err => console.log(err))
        }
    }
}

class Race {
    constructor() {
        this.race = (Race, raceName) => {
            const Map = Race.createMap();
            const MyCar = Race.myCar;
            const Enemies = Race.createEnemies().generateEnemies();
        
            Enemies.push(MyCar)
            
            const Places = Race.findPlaces();
            const places = Places.racePlaces(Enemies)
            
            //console.log(`Squad: ${Enemies}`);
            //console.log(`Places: ${JSON.stringify(places)}`);
            
            console.log(MyCar["title"])
        
            const myPlace = places.indexOf(MyCar) + 1
            
            console.log(`Place: ${myPlace}  Reward: ${Map.rewards(myPlace, Map)}`);
            return {
                race: `${raceName} Race`,
                car: MyCar["title"],
                place: myPlace,
                reward: Math.floor(Map.rewards(myPlace, Map))
            }
        }
    }
}

module.exports = new RaceControlFacade();