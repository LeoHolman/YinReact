const express = require('express');
const Recording = require('../models/recording');

const router = new express.Router();

router.get('/recordings/:_id', async (req, res, next) => {
    const _id = req.params._id;
    const recording = await Recording.findOne({_id});
    res.send(recording);
});

router.post('/recordings/add/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log('hit');
    const username = req.body.username;
    const user = await User.findOne({username});
    const dataset = await req.body.dataset;
    try {
        const newRecording = new Recording({user: user._id, data: dataset});
        newRecording.save().then( async () => {
            console.log('recordingsave');
            // const retrieve = await User.findById(newRecording.user);
            res.send(`Recording saved successfully.`);
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;