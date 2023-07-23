const mongoose = require('mongoose')
const passport = require('passport')
const config = require('../config/db')
require('../config/passport')(passport)
const express = require('express')
const jwt = require(('jsonwebtoken'))
const router = express.Router()
const User = require('../models/user')
const Product = require('../models/product')

router.post('/signup', async(req, res)=>{
  try { if(!req.body.username || !req.body.password){
        res.json({success: false, msg: "Please enter username and password"})
    }
    else{
        const newUsr = new User({
            username: req.body.username,
            password: req.body.password
        })

        await newUsr.save()}
        res.json({success: true, msg: "Successfully created user"})
    }
    catch(err){
        if(err)  res.json({success: false, msg: "Username is already exists."})
    }
})

router.post('/signin', async(req, res)=>{
  try {const user = await User.findOne({
        username: req.body.username
    })
    if (!user){
        res.status(401).send({success: false, msg: "User not found!"})
    }
    else{
        User.comparePassword(req.body.password, user.password, (err, isMatch)=>{
            if(isMatch && !err){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: '24h'
                })
               res.cookie('JWT', token)
                res.json({success: true, token: 'JWT ' + token})
            }
            else{
                res.status(401).send({success: false, msg: "Authentication failed. Wrong credentials"})
            }
        })
    }}
    catch(err){
        res.json({success: false, msg: err})
    }
})

router.get('/signout', (req, res, next)=>{
    res.clearCookie('JWT');
    res.status(200).json({ message: 'You are logged out!' });
})



router.post('/products', passport.authenticate('jwt', {session: false}), (req,res)=>{
    
    const token = getToken(req.headers)
    if(token){
        const newProd = new Product({
            productName: req.body.productName,
            price: req.body.price,
            category: req.body. category,
            rating: req.body.rating,
            brand: req.body.brand
        })
        newProd.save((err)=>{
            if(err) return res.json({success: false, msg: 'Product listing failed'})
            res.json({success: true, msg: "Product listing successful."})
        })
    }
    else{
        return res.status(403).send({success: false, msg: "Unautherized."})
    }
})

router.get('/product', passport.authenticate('jwt', {session: false}), async(req, res)=>{
    
   const token = getToken(req.headers)
    if(token){
       const prod = await Product.find({})
            res.json(prod)
    }
    else{
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    
})

const getToken = (headers)=> {
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