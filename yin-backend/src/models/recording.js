const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    wordID: {type: mongoose.Schema.Types.ObjectId, ref: 'Word'},
    audioFile: {type: mongoose.Schema.Types.ObjectId, ref: 'files'},
    pitchData: String,
    isNative: Boolean,
    createdAt: {type: Date}
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;