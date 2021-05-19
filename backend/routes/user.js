const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const user = require('../models/user');


const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'User created!'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: error
            })
        })
    });

});
router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth failed.'
            })
        }
        fetchedUser = user;
        console.log(user);
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        console.log(result);
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed.'
            })
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
        }, 'secret_this_should_be_longer', {expiresIn: '1h', });
        res.status(200).json({
            token: token,
            exiresIn: '3600',
            message: 'login success.'

        })
        
    })
    .catch(err => {
        console.log(err)
        return res.status(401).json({
            message: 'Auth failed.'
        })
    })

});
module.exports = router;