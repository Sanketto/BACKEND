const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false,
        required: true
    }
})

UserSchema.pre("save", function(next){
    const user = this;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, null, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next()
            })
        })
    }

    else{
        return next();
    }
})

UserSchema.statics.comparePassword = function(password, comparePassword, cb){
    bcrypt.compare(password, comparePassword, function(err, isMatch){
        if(err) return cb(err)

        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema);