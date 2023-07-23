const mongoose = require('mongoose')
const passport = require('passport')
const config = require('../config/db')
require('../config/passport')(passport)
const express = require('express')
const jwt = require(('jsonwebtoken'))
const router = express.Router()
const User = require('../models/user')
const Product = require('../models/product')
const verify = require('../utility/verify')
const paginate = require('../utility/pagination')

router.post('/signup/admin', async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, msg: "Please enter username and password" })
        }
        else {
            const newUsr = new User({
                username: req.body.username,
                password: req.body.password,
                admin: true
            })

            await newUsr.save()
        }
        res.json({ success: true, msg: "Successfully created Admin user" })
    }
    catch (err) {
        if (err) res.json({ success: false, msg: "Username is already exists." })
    }
})
router.post('/signup/user', async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            res.json({ success: false, msg: "Please enter username and password" })
        }
        else {
            const newUsr = new User({
                username: req.body.username,
                password: req.body.password
            })

            await newUsr.save()
        }
        res.json({ success: true, msg: "Successfully created user" })
    }
    catch (err) {
        if (err) res.json({ success: false, msg: "Username is already exists." })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })
        if (!user) {
            res.status(401).send({ success: false, msg: "User not found!" })
        }
        else {

            User.comparePassword(req.body.password, user.password, (err, isMatch) => {
                if (isMatch && !err) {
                    const token = jwt.sign(user.toObject(), config.secret, {
                        expiresIn: '24h'
                    })
                    res.cookie('JWT', token, { maxAge: 24 * 60 * 60 * 1000 })
                    res.json({ success: true, token: 'JWT ' + token })
                }
                else {
                    res.status(401).send({ success: false, msg: "Authentication failed. Wrong credentials" })
                }
            })
        }
    }
    catch (err) {
        res.json({ success: false, msg: err })
    }
})

router.get('/signout', (req, res, next) => {
    res.clearCookie('JWT');
    res.status(200).json({ message: 'You are logged out!' });
})



router.post('/admin/add-product', passport.authenticate('jwt', { session: false }), verify, async (req, res, next) => {

    const token = getToken(req.headers)
    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) return res.status(403).json({ success: false, msg: err })
            const user = await User.findById(decoded._id);
            req.user = { ...user };
            next();
        })
        if (req.user["admin"]) {
            const newProd = new Product({
                title: req.body.title,
                price: req.body.price,
                category: req.body.category,
                rating: req.body.rating,
                brand: req.body.brand
            })
            await newProd.save()
            res.json({ success: true, msg: "Product listing successful." })
        }
        else {
            return res.status(403).send({ success: false, msg: "Please login as admin to ADD products" })
        }
    }
    else {
        return res.status(403).send({ success: false, msg: "Please login." })
    }
})

router.put('/admin/change/:id', passport.authenticate('jwt', { session: false }), verify, async (req, res, next) => {
    const token = getToken(req.headers)
    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) return res.status(403).json({ success: false, msg: err })
            const user = await User.findById(decoded._id);
            req.user = { ...user };
            next();
        })
        if (req.user["admin"]) {
            const id = req.params.id;
            await Product.findByIdAndUpdate({ _id: id }, req.body)
                .then((data) => res.send({ status: true, msg: "Product UPDATE successful", data: [data] }))

        }
        else {
            return res.status(403).send({ success: false, msg: "Please login as admin to UPDATE products" })
        }
    }
    else {
        return res.status(403).send({ success: false, msg: "Please login." })
    }
})

router.delete('/admin/delete-product/:id', passport.authenticate('jwt', { session: false }), verify, async (req, res, next) => {
    const token = getToken(req.headers)
    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) return res.status(403).json({ success: false, msg: err })
            const user = await User.findById(decoded._id);
            req.user = { ...user };
            next();
        })
        if (req.user["admin"]) {
            const id = req.params.id;
            await Product.findByIdAndDelete({ _id: id })
                .then((data) => res.send({ status: true, msg: "Product DELETE successful", data: [data] }))

        }
        else {
            return res.status(403).send({ success: false, msg: "Please login as admin to DELETE products" })
        }
    }
    else {
        return res.status(403).send({ success: false, msg: "Please login." })
    }
})

router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const token = getToken(req.headers)
    if (token) {
        paginate(req, res);
    }
    else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }

})


const getToken = (headers) => {
    if (headers && headers['cookie']) {
        const cookie = headers['cookie'].split('=')[1];
        const token = cookie.split(';')[0]
        if (token) {
            return token;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router