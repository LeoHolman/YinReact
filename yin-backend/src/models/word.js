const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    audioFile: String, 
    pinyin: String, 
    correctTone: Number, 
    character: String,
    native_recording: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NativeRecording'
    }
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;