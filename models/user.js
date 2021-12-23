const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

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

const User = mongoose.model("User", UserSchema);
module.exports = User;