const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Component = new Schema(
    {
        type: { type: String, required: true },
        speed: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('components', Component)