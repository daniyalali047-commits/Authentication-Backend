import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },
    refreshToken: {
        type: String,
        required: [true, 'refresh token is required']
    },
    ip: {
        type: String,
        default: 'unknown'
    },
    userAgent: {
        type: String,
        default: 'unknown'
    },
    revoked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const sessionmodel = mongoose.model('Session', sessionSchema)
export default sessionmodel
