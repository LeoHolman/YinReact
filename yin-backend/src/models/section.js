const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: String,
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    description: String,
    is_quiz: Boolean,
    quizSections:[{type:Number}]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;