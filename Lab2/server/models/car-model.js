const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Car = new Schema(
    {
        name: { type: String, required: true },
        title: { type: String, required: true  },
        engine: { type: Object},
        wheels: { type: Object},
        wing: { type: Object}
    },
    { timestamps: true },
)

module.exports = mongoose.model('car', Car)