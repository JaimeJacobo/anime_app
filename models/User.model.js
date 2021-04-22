const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true, minlength: 8},
    toSeeAnimes: [Object],
    currentAnimes: [Object],
    watchedAnimes: [Object]
}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model('User', userSchema)

module.exports = User

