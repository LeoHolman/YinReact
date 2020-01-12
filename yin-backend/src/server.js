import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import * as argon2 from 'argon2';
import { read } from 'fs';
const randomBytes = require('randombytes');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PRIVATE_KEY = 'donttellnobody';
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const d3 = require('d3');
const session = require('express-session');
const SESSION_KEY = 'keyboardcatfire99999999';
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/learning-mongo', {useNewUrlParser: true, useUnifiedTopology: true});

var wordSchema = new mongoose.Schema({
    audioFile: String, 
    pinyin: String, 
    correctTone: Number, 
    character: String,
    native_recording: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NativeRecording'
    }
});

var lessonSchema = new mongoose.Schema({
    name: String,
    words: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    description: String,
    is_quiz: Boolean,
    quizSections:[{type:Number}]
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    is_teacher: Boolean,
    baseline: Number
});

var recordingSchema = new mongoose.Schema({
    word: {type: mongoose.Schema.Types.ObjectId, ref: 'Word'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    data: String,
});

var nativeRecordingSchema = new mongoose.Schema({
    data: String
});

var Recording = mongoose.model('Recording', recordingSchema);

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

var NativeRecording = mongoose.model('NativeRecording', nativeRecordingSchema);

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
app.use(express.static(path.join(__dirname,'/build')));
app.use(express.static('src/uploads'));
app.use(cookieParser());
app.use(session({
    'secret': SESSION_KEY,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 30 * 60 * 1000,httpOnly: false , domain:'127.0.0.1', secure:false },//sameSite: false
}));

app.get('/sessions/', (req, res, next) => {
    // res.cookie('hello','world');
    if(req.session.page_views){
        req.session.page_views++;
        console.log(req.session.page_views);
        res.send(`Seen ${req.session.page_views}`)
    } else {
        req.session.page_views = 1;
        console.log('Session set');
        console.log(req.sessionID);
        res.send('Welcome');
    }
})

// WORD API
// ===========================================
app.post('/words/add/', (req, res, next) => {
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
        const word = await Word.find({character})
        .populate('native_recording')
        .exec( (err, _word) => {
            res.send(_word);
        });
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

app.delete('/words/:character/delete', async (req, res, next) => {
    const character = req.params.character;
    try {
        const wordToDelete = await Word.deleteOne({character});
        res.send(`${character} deleted successfully.`);
    } catch (ex) {
        res.status(500).send('Something went wrong.');
    }
});

// LESSON API
// ===========================================
app.get('/lessons/all/', async (req, res, next) => {
    try {
        const allLessons = await Lesson.find({}).populate('words');
        res.send(allLessons);
    } catch (ex) {
        res.status(500).send('Something went wrong');
    }
});

app.get('/lessons/:name/', async (req, res, next) => {
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

app.get('/lessons/:name/words/', async (req, res, next) => {
    const name = req.params.name;
    const lesson = await Lesson.findOne({name});
    const words = await Word.find({'_id': { $in: lesson.words}})
    res.send(words);
})

app.post('/lessons/add/', (req, res, next) => {
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

app.put('/lessons/:name/edit/', async (req, res, next) => {
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

app.delete('/lessons/:name/delete/', async (req, res, next) => {
    const name = req.params.name;
    const lessonToDelete = await Lesson.deleteOne({name});
    res.send(`${name} deleted successfully.`);
});

// USER API
// ===========================================
app.post('/signup/', async (req, res) => {
    const username = req.body.username;
    const nameUnavailable = await User.findOne({username});
    if(!nameUnavailable){
        const salt = randomBytes(32);
        const hashedPass = await argon2.hash(req.body.password, {salt});
        const newUser = new User({ username: req.body.username, password: hashedPass, salt: salt.toString('hex'), baseline: req.body.baseline});
        newUser.save().then( () => {
            res.send(`Hello! ${req.body.username}`)
        });
    } else {
        res.send('Username taken, please try another.');
    }
});

app.post('/login/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const userRecord = await User.findOne({username});
    if(!userRecord){
        res.status(401).send('Username/password incorrect');
        console.log("Not found");
    } else {
        const userSalt = userRecord.salt;
        const incomingPassword = req.body.password;
        const hashedIncomingPassword = await argon2.hash(incomingPassword, {userSalt}); 
        const correctPassword = await argon2.verify(userRecord.password, incomingPassword);
        if (correctPassword){
            req.session.user = userRecord._id;
            res.status(204).send();
        } else {
            res.status(401).send('Username/password incorrect.');
        }
    }
});

app.post('/user/baseline/add/', async (req, res, next) => {

});

// RECORDING API
// ===========================================
app.get('/recordings/:_id', async (req, res, next) => {
    const _id = req.params._id;
    const recording = await Recording.findOne({_id});
    res.send(recording);
});

app.post('/recordings/add/', async (req, res, next) => {
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

// QUIZSCORE API
// ===========================================
app.post('/quizScores/add/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
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

app.get('/quizScores/:username/:lessonname/', async (req, res, next) => {
    const username = req.params.username;
    const lessonname = req.params.lessonname; 
    const user = await User.findOne({username});
    const lesson = await Lesson.findOne({name: lessonname});
    const quizScores = await QuizScore.find({user: user._id, lesson: lesson._id});
    res.send(quizScores);
});

//NATIVE RECORDING API
//==========================================
app.post('/nativeRecording/add/', async (req,res,next) => {
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
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

//Start application
app.listen(8000, () => console.log('Listening on port 8000'));