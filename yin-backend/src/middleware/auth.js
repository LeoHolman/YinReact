const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const userID = req.session && req.session.user;
        if (!userID) {
            res.status(401).send('You must log in first.');
            return;
        }

        const user = await User.findById(userID);
        if (!user) {
            console.log('Session present, but no such user exists');
            res.status(404).send('No such user found');
            return;
        }

        req.user = user;
        next();
    } catch (ex) {
        console.log(ex);
        res.status(401).send('You must log in first.');
        return;
    }
};

const getSafeUser = async (req, res, next) => {
    if (!req.user) {
        res.status(401).send('You must log in first.');
        return;
    }

    req.user = {
        username: req.user.username || null,
        activeLang: req.user.activeLang || null,
        is_teacher: Boolean(req.user.is_teacher),
        baseline: req.user.baseline ?? null
    };
    next();
};

module.exports = { auth, getSafeUser};