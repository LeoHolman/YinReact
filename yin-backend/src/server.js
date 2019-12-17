import express from 'express';
import bodyParser from 'body-parser';
import * as argon2 from 'argon2';
const randomBytes = require('randombytes');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/learning-mongo', {useNewUrlParser: true});
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
});

var User = mongoose.model('User', userSchema);
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
app.use(bodyParser.json());
app.post('/*', (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/hello', (req, res) => res.send('Hello'));

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
    const username = req.body.username;
    const userRecord = await User.findOne({username});
    if(!userRecord){
        res.send('Username/password incorrect');
    } else {
        const userSalt = userRecord.salt;
        const incomingPassword = req.body.password;
        const hashedIncomingPassword = await argon2.hash(incomingPassword, {userSalt}); 
        const correctPassword = await argon2.verify(userRecord.password, incomingPassword);
        console.log(userRecord.password);
        console.log(hashedIncomingPassword);
        if (correctPassword){
            res.send(`Hello! ${userRecord}`);
        } else {
            res.send('Username/passowrd incorrect.');
        }
    }
});

app.post('/savedata/', (req, res, next) => {
    tokenMiddleWare(req, res, next);
    console.log('success!');
})

app.listen(8000, () => console.log('Listening on port 8000'));