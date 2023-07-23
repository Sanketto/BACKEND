const JwtStrategy=require("passport-jwt").Strategy;
const ExtractJwt=require("passport-jwt").ExtractJwt;


const User = require('../models/user')
const config = require('../config/db')
const extractCookie =(req)=>{
    let token = null;
    if(req && req.cookies) token = req.cookies['JWT']
    return token;
}
module.exports = function(passport){
    const options= {}
    options.jwtFromRequest = extractCookie;
    options.secretOrKey = config.secret
    passport.use(new JwtStrategy(options, async function(jwtPayload, done) {
     try { const user = await User.findOne({id: jwtPayload.id})
       if(user) {
        done(null, user)
       }
            else done(null, false)
        }
        catch(err){
            return done(err, false)
        }
    }))
}