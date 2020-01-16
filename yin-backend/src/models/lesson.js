const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    name: String,
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    description: String,
    is_quiz: Boolean,
    quizSections:[{type:Number}]
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;