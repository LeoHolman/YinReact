const express = require('express');
const Recording = require('../models/recording');
const User = require('../models/user');

const router = new express.Router();

router.get('/api/recordings/:_id', async (req, res, next) => {
    const _id = req.params._id;
    const recording = await Recording.findOne({_id});
    res.send(recording);
});

router.post('/api/recordings/add/', async (req, res, next) => {
    const user = await User.findById(req.session.user);
    const dataset = await req.body.dataset;
    try {
        const newRecording = new Recording({user: user._id, data: dataset});
        newRecording.save().then( async () => {
            console.log('Recording saved successfully');
            res.json({'recording':newRecording._id});
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;