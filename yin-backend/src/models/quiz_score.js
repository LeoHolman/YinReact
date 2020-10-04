const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
    sectionID: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: Number,
    maxScore: Number,
    recordingIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recording'}],
    createdAt: Date
});

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

module.exports = QuizScore;