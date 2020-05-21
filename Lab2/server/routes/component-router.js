const express = require('express')

const ComponentCtrl = require('../controllers/component-ctrl')
const RacesCtrl = require('../controllers/races-ctrl')
const UserCtrl = require('../controllers/user-ctrl');
const ShopCtrl = require('../controllers/shop-ctrl');



const router = express.Router()

router.post('/component', ComponentCtrl.createComponent)
router.get('/component/:type/:id', ComponentCtrl.getComponentById)
router.get('/car/set', ComponentCtrl.setCar)
router.get('/car', ComponentCtrl.getCar)

router.put('/car/title', ComponentCtrl.setTitle)
router.put('/user/name', UserCtrl.setName)

router.get('/race/spain', RacesCtrl.startSpainRace)
router.get('/race/england', RacesCtrl.startEnglandRace)

router.post('/user', UserCtrl.createUser)

router.post('/shop/create', ShopCtrl.createItem)
router.get('/shop/buy/:group/:id', ShopCtrl.getItem)

module.exports = router