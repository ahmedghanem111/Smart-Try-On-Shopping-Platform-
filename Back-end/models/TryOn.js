const mongoose = require('mongoose');

const tryOnSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // status: {
    //     type: String,
    //     enum: ['processing', 'completed', 'failed'],
    //     default: 'processing'
    // },
    personImage: { type: String, required: true },
    personImageId: { type: String },
    garmentImage: { type: String, required: true },
    garmentImageId: { type: String },
    resultImage: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

tryOnSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('TryOn', tryOnSchema);