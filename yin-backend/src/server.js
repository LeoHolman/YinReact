import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
const PRIVATE_KEY = 'donttellnobody';
const fileUpload = require('express-fileupload');
const d3 = require('d3');
const session = require('express-session');
const SESSION_KEY = 'keyboardcatfire99999999';
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const port = 8000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yin', {useNewUrlParser: true, useUnifiedTopology: true});

const wordRouter = require('./routers/word');
const lessonRouter = require('./routers/lesson');
const userRouter = require('./routers/user');
const recordingRouter = require('./routers/recording');
const quizScoreRouter = require('./routers/quiz_score');
const nativeRecordingRouter = require('./routers/native_recording');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}

const httpsOptions = {
    key: fs.readFileSync('./src/security/cert.key'),
    cert: fs.readFileSync('./src/security/cert.pem')
}

const app = express();
app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(session({
    'secret': SESSION_KEY,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: true,
    httpOnly: false,
    cookie: { maxAge: 30 * 60 * 1000},//sameSite: false
}));
app.get('/*', (req, res, next) =>{
    next();
});
app.use(userRouter);
app.use(wordRouter);
app.use(lessonRouter);
app.use(recordingRouter);
app.use(quizScoreRouter);
app.use(nativeRecordingRouter);

app.get('/hello/', (req, res, next) => {
    res.send('success!');

});

app.get('/sessions/', (req, res, next) => {
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials':'true'
    })
    
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})
//Start application
// app.listen(8000, () => console.log('Listening on port 8000'));
console.log(path.join(__dirname, 'uploads'));
const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('Running on port '+ port);
})