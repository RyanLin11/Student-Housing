const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    room: {
        type: ObjectId,
        ref: 'Room',
    },
    university: {
        type: String,
    },
    term: {
        type: String,
    },
    program: {
        type: String,
    },
    photo: {
        type: ObjectId,
        ref: 'Photo',
    },
});

UserSchema.pre('save', async function(next) {
    this.password = await new Promise((resolve, reject) => {
        bcrypt.hash(this.password, 10, (err, hash) => {
            if(err) {
                reject(err);
            }
            resolve(hash);
        })
    });
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if(err) {
                reject(err);
            }
            resolve(isMatch);
        });
    })
}

const User = mongoose.model("User", UserSchema);
module.exports = User;