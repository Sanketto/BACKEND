const JwtStrategy=require("passport-jwt").Strategy;
const ExtractJwt=require("passport-jwt").ExtractJwt;


const User = require('../models/user')
const config = require('../config/db')

module.exports = function(passport){
    const options= {}
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    options.secretOrKey = config.secret
    passport.use(new JwtStrategy(options, function(jwtPayload, ok) {
        User.findOne({id: jwtPayload.id}, function(err, user) {
            if(err) return ok(err, false)
            if(user) ok(null, user)
            else ok(null, false)
        } )
    }))
}