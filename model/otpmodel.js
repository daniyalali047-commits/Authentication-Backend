import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    otpHash: {
        type: String,
        required: [true, 'OTP hash is required']
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiry time is required']
    }
}, {
    timestamps: true
})

const otpmodel = mongoose.model('Otp', otpSchema)
export default otpmodel