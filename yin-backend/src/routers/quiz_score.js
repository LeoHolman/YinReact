const express = require('express');
const QuizScore = require('../models/quiz_score');

const router = new express.Router();

router.post('/quizScores/add/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const fulllesson = await Lesson.findOne({"name": req.body.lesson}).exec();
    const lesson = fulllesson.id;
    const fulluser = await User.findOne({"username": req.body.user}).exec();
    const user = fulluser.id;
    const score = req.body.score;
    const maxScore = req.body.maxScore;
    const recordings = req.body.recordings;
    try {
        const newQuizScore = new QuizScore({lesson, user, score, maxScore, recordings});
        newQuizScore.save().then( () => {
            res.send('Score saved successfully.');
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong.');
    }
});

router.get('/quizScores/:username/:lessonname/', async (req, res, next) => {
    const username = req.params.username;
    const lessonname = req.params.lessonname; 
    const user = await User.findOne({username});
    const lesson = await Lesson.findOne({name: lessonname});
    const quizScores = await QuizScore.find({user: user._id, lesson: lesson._id});
    res.send(quizScores);
});

module.exports = router;