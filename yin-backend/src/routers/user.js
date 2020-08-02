const express = require('express');
const User = require('../models/user');
import * as argon2 from 'argon2';
import cookieParser from 'cookie-parser';
const randomBytes = require('randombytes');
const mongoose = require('mongoose');
const {auth, getSafeUser} = require('../middleware/auth');

const router = new express.Router();

router.post('/api/signup/', async (req, res) => {
    const username = req.body.username;
    const nameUnavailable = await User.findOne({username});
    if(!nameUnavailable){
        const salt = randomBytes(32);
        const hashedPass = await argon2.hash(req.body.password, {salt});
        const newUser = new User({ username: req.body.username,
                                   password: hashedPass,
                                   is_teacher: false,
                                   salt: salt.toString('hex'),
                                   baseline: req.body.baseline});
        newUser.save().then( () => {
            res.send(`Hello! ${req.body.username}`)
        });
    } else {
        res.send('Username taken, please try another.');
    }
});

router.get('/api/logout', async (req, res, next) =>{
    try{
        req.session.destroy(function(){
            console.log('logged out');
        });
        res.redirect('/login');
        // res.clearCookie('connection.sid');
        // req.session = null;
        // res.setHeader('set-cookie', 'connect.sid=; max-age=0');
        // res.clearCookie('connect.sid');
        res.status(200).send('logout successful?');
    } catch {
        res.status(401).send('Logout unsuccessful');
        console.log("caught that error in logout");
    }

})


router.post('/api/login/', async (req, res, next) => {
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

router.get('/api/user/me/', [auth, getSafeUser], async (req, res, next) => {
        res.json(req.user);
});


router.post('/api/user/baseline/add/', auth, async (req, res, next) => {
    const user = req.user;
    user.baseline = req.body.baseline;
    user.save();
    res.sendStatus(204);
});

module.exports = router;