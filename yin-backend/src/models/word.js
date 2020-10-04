const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    character: String,
    pinyin: String, 
    correctTone: [{type: Number}] 
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;