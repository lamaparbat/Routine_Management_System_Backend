const mongoose = require('mongoose')
const signupSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: false,
            
        },
            userEmail: {
                type: String,
                required: true,
                unique: true,
            },
            userPicture: {
                type: String,
                required: true,
            },
        },
    { timestamps: true }
);

module.exports = mongoose.model('heraldSignUp', signupSchema);