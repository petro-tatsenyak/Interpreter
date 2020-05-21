const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShopComponent = new Schema(
    {
        component: { type: Object, required: true },
        group: { type: String, required: true },
        price: { type: Number, required: true },
        level: { type: Number, required: true },
        allowed: { type: Boolean }
    },
    { timestamps: true },
)

module.exports = mongoose.model('shopComponent', ShopComponent, "shop")