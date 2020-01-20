const express = require('express');
const QuizScore = require('../models/quiz_score');
const {auth} = require('../middleware/auth');
const User = require('../models/user');
const Lesson = require('../models/lesson');

const router = new express.Router();

router.post('/api/quizScores/add/', async (req, res, next) => {
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

router.get('/api/quizScores/me/:lessonname/', auth, async (req, res, next) => {
    const user = req.user;
    try{
        const lesson = await Lesson.findOne({name: req.params.lessonname});
        try{
            const quizScores = await QuizScore.find({user, lesson});
            res.json(quizScores);
        } catch(ex) {
            res.status(404).send("You haven't taken this quiz yet.");
        }
    } catch (ex) {
        res.status(404).send('Lesson not found');
    }
});

module.exports = router;