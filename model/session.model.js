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
        required: [true, 'ip is required']
    },
    userAgent: {
        type: String,
        required: [true, 'user agent is required']
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
