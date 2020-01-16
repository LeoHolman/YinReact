const express = require('express');
const Lesson = require('../models/lesson');
const Word = require('../models/word');

const router = new express.Router();

router.get('/lessons/all/', async (req, res, next) => {
    try {
        const allLessons = await Lesson.find({}).populate('words');
        res.send(allLessons);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

router.get('/lessons/:name/', async (req, res, next) => {
    const name = req.params.name; 
    try {
        // const lesson = await (await )
        Lesson.findOne({name})
        .populate({
            path:'words', 
            populate: {
                path: 'native_recording'
            }
        })
        .exec( (err, _lesson) => {
            if (err){
                console.log(err);
                res.status(500).send('Something went wrong');
            }
            res.send(_lesson);
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});

router.get('/lessons/:name/words/', async (req, res, next) => {
    const name = req.params.name;
    const lesson = await Lesson.findOne({name});
    const words = await Word.find({'_id': { $in: lesson.words}})
    res.send(words);
})

router.post('/lessons/add/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const name = req.body.name;
    const words = req.body.words;
    const description = req.body.description;
    const is_quiz = req.body.is_quiz;
    const quizSections = req.body.quizSections;
    const newLesson = new Lesson({name, words, description, is_quiz, quizSections});
    newLesson.save().then( () => {
        res.send(`${newLesson.name} saved successfully!`);
    });
});

router.put('/lessons/:name/edit/', async (req, res, next) => {
    const name = req.params.name;
    const newName = req.body.name;
    const words = req.body.words;
    const description = req.body.description;
    const is_quiz = req.body.is_quiz;
    const quizSections = req.body.quizSections;
    const lessonToUpdate = await Lesson.findOne({name});
    lessonToUpdate.name = newName;
    lessonToUpdate.words = words;
    lessonToUpdate.description = description;
    lessonToUpdate.is_quiz = is_quiz;
    lessonToUpdate.quizSections = quizSections;
    await lessonToUpdate.save();
    res.send(`${lessonToUpdate.name} updated successfully.`);
});

router.delete('/lessons/:name/delete/', async (req, res, next) => {
    const name = req.params.name;
    const lessonToDelete = await Lesson.deleteOne({name});
    res.send(`${name} deleted successfully.`);
});

module.exports = router;