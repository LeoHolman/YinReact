const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    is_teacher: Boolean,
    baseline: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;