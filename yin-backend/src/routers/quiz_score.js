const express = require('express');
const QuizScore = require('../models/quiz_score');
const {auth} = require('../middleware/auth');
const User = require('../models/user');
const Lesson = require('../models/lesson');

const router = new express.Router();

router.post('/api/quizScores/add/', async (req, res, next) => {
    try {
        const fulllesson = await Lesson.findOne({ name: req.body.lesson });
        if (!fulllesson) {
            res.status(404).send('Lesson not found');
            return;
        }

        const fulluser = await User.findOne({ username: req.body.user });
        if (!fulluser) {
            res.status(404).send('User not found');
            return;
        }

        const lesson = fulllesson._id;
        const user = fulluser._id;
        const score = req.body.score;
        const maxScore = req.body.maxScore;
        const recordings = req.body.recordings;

        const newQuizScore = new QuizScore({ lesson, user, score, maxScore, recordings });
        await newQuizScore.save();
        res.send('Score saved successfully.');
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