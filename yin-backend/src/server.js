import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import * as argon2 from 'argon2';
const randomBytes = require('randombytes');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PRIVATE_KEY = 'donttellnobody';
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/learning-mongo', {useNewUrlParser: true});

var wordSchema = new mongoose.Schema({
    audioFile: String, 
    pinyin: String, 
    correctTone: Number, 
    character: String,
});

var lessonSchema = new mongoose.Schema({
    name: String,
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    description: String,
    is_quiz: Boolean
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    is_teacher: Boolean,
});

var recordingSchema = new mongoose.Schema({
    word: {type: mongoose.Schema.Types.ObjectId, ref: 'Word'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    data: [{time: String, frequency: String}],
});

var quizScoreSchema = new mongoose.Schema({
    lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: Number,
    maxScore: Number,
    recordings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recording'}]
});

var Word = mongoose.model('Word', wordSchema);

var Lesson = mongoose.model('Lesson', lessonSchema);

var User = mongoose.model('User', userSchema);

var Recording = mongoose.model('Recording', recordingSchema);

var QuizScore = mongoose.model('QuizScore', quizScoreSchema);

userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({_id: this._id}, 'myprivatekey');
    return token;
}

function validateUser(user) {
    const schema = {
        username: Joi.string(),
        password: Joi.string()
    }
    return Joi.validate(user, schema);
}

function tokenMiddleWare(req, res, next) {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if(!token){ return res.status(401).send("Access denied.")};

    try {
        const decoded = jwt.verify(token, 'myprivatekey');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
};

const app = express();
app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors());
app.get('/*', (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.post('/*', (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

// Not sure what this is, suspect it's a demo to myself to understand middleware
// app.post('/savedata/', (req, res, next) => {
//     tokenMiddleWare(req, res, next);
//     console.log('success!');
// });

// WORD API
// ===========================================
app.post('/words/add/', (req, res, next) => {
    const audioDirPath = path.join(__dirname, 'uploads', 'test');
    const audioPath = path.join(audioDirPath, req.files.audioFile.name);
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
            const newWord = new Word({audioFile: audioPath, pinyin, correctTone, character});
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

app.get('/words/all/', async (req, res, next) => {
    try {
        const allWords = await Word.find({});
        res.send(allWords);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
})

app.get('/words/:character/', async (req, res, next) => {
    const character = req.params.character;
    try {
        const word = await Word.find({character});
        res.send(word);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});


// LESSON API
// ===========================================
app.get('/lessons/all/', async (req, res, next) => {
    try {
        const allLessons = await Lesson.find({});
        res.send(allLessons);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

app.get('/lessons/:name/', async (req, res, next) => {
    const name = req.params.name; 
    try {
        const lesson = await Lesson.findOne({name});
        res.send(lesson);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

app.post('/lessons/add/', (req, res, next) => {
    const name = req.body.name;
    const words = req.body.words;
    const description = req.body.description;
    const is_quiz = req.body.is_quiz;
    const newLesson = new Lesson({name, words, description, is_quiz});
    newLesson.save().then( () => {
        res.send(`${newLesson.name} saved successfully!`);
    });
});


// USER API
// ===========================================
app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const nameUnavailable = await User.findOne({username});
    if(!nameUnavailable){
        const salt = randomBytes(32);
        const hashedPass = await argon2.hash(req.body.password, {salt});
        const newUser = new User({ username: req.body.username, password: hashedPass, salt: salt.toString('hex')});
        newUser.save().then( () => {
            res.send(`Hello! ${req.body.username}`)
        });
    } else {
        res.send('Username taken, please try another.');
    }
});

app.post('/login/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const userRecord = await User.findOne({username});
    if(!userRecord){
        res.send('Username/password incorrect');
    } else {
        const userSalt = userRecord.salt;
        const incomingPassword = req.body.password;
        const hashedIncomingPassword = await argon2.hash(incomingPassword, {userSalt}); 
        const correctPassword = await argon2.verify(userRecord.password, incomingPassword);
        if (correctPassword){
            const token = await jwt.sign({user: {username: userRecord.username}}, PRIVATE_KEY);
            res.send(token);
        } else {
            res.send('Username/password incorrect.');
        }
    }
});

// RECORDING API
// ===========================================
app.post('/recordings/add', async(req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.headers.token){
       const verification = await jwt.verify(req.headers.token, PRIVATE_KEY)
       const username = verification.user.username;
       const user = await User.findOne({username});
       const dataPayload = await req.body.record;
       try {
            const newRecording = new Recording({user: user._id, data: dataPayload});
            newRecording.save().then( async () => {
                const retrieve = await User.findById(newRecording.user);
                res.send(`Recording saved successfully.`);
            });
       } catch (ex) {
           console.log(ex);
           res.status(500).send('Something went wrong');
       }
   } 
});

// QUIZSCORE API
// ===========================================

app.listen(8000, () => console.log('Listening on port 8000'));