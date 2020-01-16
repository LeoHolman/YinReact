const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    word: {type: mongoose.Schema.Types.ObjectId, ref: 'Word'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    data: String,
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;