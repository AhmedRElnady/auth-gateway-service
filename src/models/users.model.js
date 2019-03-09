const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        // unique: true
    },
    password:{
        type: String,
        trim: true,
        required: true
    }, 
    role: {
        type: String,
        enum: ['SHOP_ADMIN', 'CUSTOMER'],
        required: true
    }
}, {timestamps: true });

userSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret.deleted;
        delete ret._id;
        delete ret.__v;
    }
})


const User = mongoose.model('User', userSchema);

module.exports = User;
