const mongoose = require('mongoose');

const nativeRecordingSchema = new mongoose.Schema({
    data: String
});

const NativeRecording = mongoose.model('NativeRecording', nativeRecordingSchema);

module.exports = NativeRecording;