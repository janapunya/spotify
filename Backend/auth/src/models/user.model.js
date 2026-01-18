const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imgurl: {
        type: String,
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['User', 'Artist'],
        default: 'User'
    }
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;