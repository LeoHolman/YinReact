const User = require('../models/user');

const auth = async (req, res, next) => {
    try{
        const userID = req.session.user;
        try {
                const user = await User.findById(userID);
                req.user = user;
                next();
            } catch (ex) {
                console.log(ex);
                console.log('Session present, but no such user exists');
                res.status(404).send('No such user found');
                return;
            }
    } catch (ex) {
        console.log(ex);
        console.log('No session set');
        res.status(401).send('You must log in first.');
        return;
    } 
}

const getSafeUser = async (req, res, next) => {
    req.user = {
        username: req.user.username, 
        is_teacher: req.user.is_teacher || false,
        baseline: req.user.baseline || null
    };
    next();
}

module.exports = { auth, getSafeUser};