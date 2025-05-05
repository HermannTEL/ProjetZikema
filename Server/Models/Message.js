// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    draftStatus: {
        sender: { type: Boolean, default: false },  
        recipient: { type: Boolean, default: false } 
    },
    trashStatus: {
        sender: { type: Boolean, default: false }, 
        recipient: { type: Boolean, default: false } 
    },
    dateSent: {
        type: Date,
        default: Date.now,
    },
    dateDeleted: {
        type: Date,
        default: null, 
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
