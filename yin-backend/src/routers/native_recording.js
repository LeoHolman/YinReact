const express = require('express');
const NativeRecording = require('../models/native_recording');

const router = new express.Router();

router.post('/nativeRecording/add/', async (req,res,next) => {
    const data = new String(req.files.recording.data);
    const incomingword = req.body.word;
    try{
        const word = await Word.findOne({'_id': incomingword});
        try{
            let newNativeRecording = new NativeRecording({data});
            newNativeRecording.save();
            word.native_recording = newNativeRecording.id;
            word.save();
            res.send(data);

        } catch (ex) {
            console.log(ex);
            res.status(500).send(ex);
        }

    } catch (ex) {
        res.status(404).send('Word not found');
    }
})

module.exports = router;