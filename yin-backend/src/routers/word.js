const express = require('express');
const Word = require('../models/word');
const NativeRecording = require('../models/native_recording');
const path = require('path');
const fs = require('fs');
const { extractPitchFromWavFile } = require('../services/pitch');

const router = new express.Router();

router.post('/api/words/add/', async (req, res, next) => {
    const relativeBase = path.join('uploads', 'test');
    const audioDirPath = path.join(path.dirname(__dirname), relativeBase);
    const audioPath = path.join(audioDirPath, req.files.audioFile.name);
    const storePath = path.join('test', req.files.audioFile.name);
    const pinyin = req.body.pinyin;
    const correctTone = req.body.correctTone.split(',');
    const character = req.body.character;
    try {
        if(!fs.existsSync(audioDirPath)){
            fs.mkdirSync(audioDirPath, { recursive: true });
        }
        const incomingFile = req.files.audioFile;
        await incomingFile.mv(audioPath);

        const formattedData = await extractPitchFromWavFile(audioPath);
        const newNativeRecording = new NativeRecording({ data: formattedData });
        await newNativeRecording.save();

        const newWord = new Word({audioFile: storePath, pinyin, correctTone, character, native_recording: newNativeRecording});
        await newWord.save();
        res.status(200).send('Upload complete.');
        return;
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Internal server error');
    }
});

router.get('/api/words/all/', async (req, res, next) => {
    try {
        const allWords = await Word.find({});
        res.send(allWords);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
})

router.get('/api/words/:character/', async (req, res, next) => {
    const character = req.params.character;
    try {
        const words = await Word.find({ character }).populate('native_recording');
        res.send(words);
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something went wrong');
    }
});

router.delete('/api/words/:character/delete', async (req, res, next) => {
    const character = req.params.character;
    try {
        const wordToDelete = await Word.deleteOne({character});
        res.send(`${character} deleted successfully.`);
    } catch (ex) {
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;