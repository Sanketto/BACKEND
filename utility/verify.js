const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/db')

module.exports =  async function verify(req, res, next){
const token = getToken(req.headers)
    
        jwt.verify(token, config.secret, async(err, decoded)=>{
            if(err) return res.status(403).json({success: false, msg: err})
            const user = await User.findById(decoded._id);
            req.user = user;
            next();
        })
    }


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