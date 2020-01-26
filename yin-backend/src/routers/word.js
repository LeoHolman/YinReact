const express = require('express');
const Word = require('../models/word');
const NativeRecording = require('../models/native_recording');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const router = new express.Router();

router.post('/api/words/add/', (req, res, next) => {
    const relativeBase = path.join('uploads', 'test');
    const audioDirPath = path.join(path.dirname(__dirname), relativeBase);
    const audioPath = path.join(audioDirPath, req.files.audioFile.name);
    const storePath = path.join('test', req.files.audioFile.name);
    const pinyin = req.body.pinyin;
    const correctTone = req.body.correctTone.split(',');
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
        incomingFile.mv(audioPath, async (err) => {
            var formData = new FormData();
            formData.append('audioData', fs.createReadStream(audioPath));
            const response = await fetch('https://yin.rit.edu/pages/audioProcessing.php', {
                method: 'POST',
                body: formData
            });
            const csvDataLocation = await response.text();
            const start = csvDataLocation.search(/(\*\*\*)/)+5
            const end = csvDataLocation.search('&&&')
            var url = csvDataLocation.substring(start,end)
            url = 'https://yin.rit.edu/' + url;
            const data = await(await fetch(url)).text();
            const newNativeRecording = new NativeRecording({data});
            newNativeRecording.save();
            if(err){
                console.log(err);
                res.status(500).send(err);
                return
            }
            const newWord = new Word({audioFile: storePath, pinyin, correctTone, character, native_recording: newNativeRecording});
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
        const word = await Word.find({character})
        .populate('native_recording')
        .exec( (err, _word) => {
            res.send(_word);
        });
    } catch (ex) {
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