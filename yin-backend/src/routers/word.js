const express = require('express');
const Word = require('../models/word');
const path = require('path');
const fs = require('fs');

const router = new express.Router();

router.post('/words/add/', (req, res, next) => {
    const relativeBase = path.join('uploads', 'test');
    const audioDirPath = path.join(__dirname, relativeBase);
    const audioPath = path.join(audioDirPath, req.files.audioFile.name);
    const storePath = path.join('test', req.files.audioFile.name);
    const pinyin = req.body.pinyin;
    const correctTone = req.body.correctTone;
    const character = req.body.character;
    try {
        if(!fs.existsSync(audioDirPath)){
            fs.mkdirSync(audioDirPath, { recursive: true}, (err) => {
                if(err){
                    console.log(err);
                }
            })
        }
        let incomingFile = req.files.audioFile;
        incomingFile.mv(audioPath, (err) => {
            if(err){
                console.log(err);
                res.status(500).send(err);
                return
            }
            const newWord = new Word({audioFile: storePath, pinyin, correctTone, character});
            newWord.save().then( () => {
                res.status(200).send('Upload complete.');
                return
            });
        })
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Internal server error');
    }
});

router.get('/words/all/', async (req, res, next) => {
    try {
        const allWords = await Word.find({});
        res.send(allWords);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
})

router.get('/words/:character/', async (req, res, next) => {
    const character = req.params.character;
    try {
        const word = await Word.find({character})
        .populate('native_recording')
        .exec( (err, _word) => {
            res.send(_word);
        });
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

router.delete('/words/:character/delete', async (req, res, next) => {
    const character = req.params.character;
    try {
        const wordToDelete = await Word.deleteOne({character});
        res.send(`${character} deleted successfully.`);
    } catch (ex) {
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;