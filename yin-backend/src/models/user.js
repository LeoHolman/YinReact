const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    is_teacher: {type: Boolean, default: false},
    baseline: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;