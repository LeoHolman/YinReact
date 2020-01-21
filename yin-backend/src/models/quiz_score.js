const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
    lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: Number,
    maxScore: Number,
    recordings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recording'}]
});

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

module.exports = QuizScore;