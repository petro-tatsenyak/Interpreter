const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        name: { type: String, required: true },
        title: { type: String, required: true  },
        coins: { type: Number, required: true },
        experience: { type: Number, required: true },
        level: { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', User)