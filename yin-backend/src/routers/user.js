const express = require('express');
const User = require('../models/user');
import * as argon2 from 'argon2';
const randomBytes = require('randombytes');

const router = new express.Router();

router.post('/signup/', async (req, res) => {
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

router.post('/login/', async (req, res, next) => {
    console.log('hit')
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials':'true'
    })
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

router.post('/user/baseline/add/', async (req, res, next) => {

});

module.exports = router;