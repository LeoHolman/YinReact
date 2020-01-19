const express = require('express');
const User = require('../models/user');
import * as argon2 from 'argon2';
const randomBytes = require('randombytes');
const mongoose = require('mongoose');

const router = new express.Router();

async function getUserBySession(req){
    try{
        const userID = req.session.user;
        try {
                const user = await User.findById(userID);
                return user;
            } catch (ex) {
                console.log(ex);
                return 401;
            }
    } catch (ex) {
        console.log(ex);
        return 401;
    } 
}

router.post('/api/signup/', async (req, res) => {
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

router.post('/api/login/', async (req, res, next) => {
    console.log('hit');
    console.log(req.session.user);
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

router.get('/api/user/me/', async (req, res, next) => {
    const user = await getUserBySession(req);
    if(user === 401){
        console.log('Session present, but no such user exists');
        res.status(404).send('No such user found');
    } else if (user === 404) {
        console.log('No session set');
        res.status(401).send('You must log in first.');
    } else {
        res.send(user.username);
    }
});

router.get('/api/user/baseline/', async (req, res, next) => {
    const user = await getUserBySession(req);
    if(!user === 401 || !user === 404){
        res.send(user.baseline);
    }
});

router.post('/api/user/baseline/add/', async (req, res, next) => {
    const user = await getUserBySession(req);
    if(!(user === 401) && !(user === 404)){
        user.baseline = req.body.baseline;
        console.log(req.body);
        user.save();
        res.sendStatus(204);
    } else {
        res.sendStatus(user);
    }
});

module.exports = router;