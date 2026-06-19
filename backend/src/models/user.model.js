const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user','seller', 'admin'],
        default: 'user'
    },
    avatar: {
        url: String,
        public_id: {
            type: String,
            default: ""
        }

    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;