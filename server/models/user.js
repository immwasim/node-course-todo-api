const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken')



var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
})


//must use function keyword because arrow methods do not bind 'this'

//override .toJSON. We dont need tokens and password etc
UserSchema.methods.toJSON = function () {
    var user = this
    var UserObject = user.toObject();

    //only need a few props
    return _.pick(UserObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var secret = '123123'

    var token = jwt.sign({ _id: user._id.toHexString(), access }, secret)
        .toString()

    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save()
        .then(() => {
            return token
        })
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    var secret = '123123';

    try {
        decoded = jwt.verify(token, secret);
    } catch (e) {
        return new Promise((resolve, reject) => {
            reject();
        });
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.pre('save', function(next){
    var user = this

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        })
    }else{
        next();
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};