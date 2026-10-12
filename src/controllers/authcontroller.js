import usermodel from '../../model/usermodel.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../../config/config.js'
import sessionmodel from '../../model/session.model.js'



export async function register(req, resp) {
    const { username, email, password } = req.body

    const isAlreadyRegistered = await usermodel.findOne({
        $or: [{ username }, { email }]
    })
    if (isAlreadyRegistered) {
        return resp.status(400).json({
            message: "User already registered"
        })
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    const user = await usermodel.create({
        username,
        email,
        password: hashedPassword
    })
    //refresh token
    const refreshtoken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: '7d'
    })

    const refreshhash = crypto.createHash('sha256').update(refreshtoken).digest('hex')

    const session = await sessionmodel.create({
        user: user._id,
        refreshToken: refreshhash,
        ip: req.ip,
        userAgent: req.get('user-agent')
    })

    const accesstoken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: '15m'
    })

    resp.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    resp.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email
        },
        token: accesstoken
    })
}

export async function login(req , resp){
    const {email , password} = req.body
    const user = await usermodel.findOne({email})

    if(!user){
        return resp.status(401).json({
            message: "Invalid email or password"
        })
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    const isPasswordMatch = hashedPassword === user.password
    if(!isPasswordMatch){
        return resp.status(401).json({
            message:"Invalid passowrd or email"
        })
    }

    const refreshtoken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: '7d'
    }
)
const refreshTokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex");
const session  = await sessionmodel.create({
    user:user._id,
    refreshToken: refreshTokenHash,
    ip:req.ip,
    userAgent:req.get('user-agent')
})
const accessToken = jwt.sign({
    id:user._id,
    sessionId:session._id
},config.JWT_SECRET,
{
    expiresIn:"15m"
}

)
resp.cookie("refreshtoken", refreshtoken, {
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
})
resp.status(200).json({
    message:"User Logged in ",
    user:{
        username:user.username,
        useremail: user.email
    },
    accessToken,
})
}
 



export async function getMe(req, resp) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return resp.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    console.log(decoded)
    const user = await usermodel.findById(decoded.id).select('-password')
    resp.status(200).json({
        message: "user fetched",
        user: {
            username: user.username,
            email: user.email
        }
    })
}

export async function refreshToken(req, resp) {
    const refreshToken = req.cookies.refreshtoken
    if (!refreshToken) {
        return resp.status(401).json({
            message: "Refresh token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const session = await sessionmodel.findOne({
        user: decoded.id,
        refreshToken: refreshHash,
        revoked: false
    })

    if (!session) {
        return resp.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const user = await usermodel.findById(decoded.id)
    if (!user) {
        return resp.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const newRefreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: '7d'
    })
    const newRefreshHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')

    session.refreshToken = newRefreshHash
    await session.save()


    const refreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
    const sessions = await sessionmodel.findOne({
        refreshToken: refreshTokenHash,
        revoked: false
    })

    if (!sessions) {
        return resp.status(401).json({
            message: "Invalid refresh token"
        })
    }
    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: '15m'
    })

    resp.cookie('refreshtoken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return resp.status(200).json({
        message: "Access token refreshed",
        accesstoken: accessToken
    })

}

export async function logout(req, resp) {
    const refreshToken = req.cookies.refreshtoken

    if (!refreshToken) {
        return resp.status(401).json({
            message: "Refresh token not found"
        })
    }
    const refrshtokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const session = await sessionmodel.findOne({
        refreshToken: refrshtokenHash,
        revoked: false
    })

    if (!session) {
        return resp.status(400).json({
            message: "invalid refresh token"
        })
    }
    session.revoked = true
    await session.save()

    resp.clearCookie('refreshtoken')
    resp.status(200).json({
        message: "user logged out successfully"
    })
}

export async function logoutAll(req, resp) {
    const refreshToken = req.cookies.refreshtoken
    if (!refreshToken) {
        return resp.status(401).json({
            message: "refresh token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionmodel.updateMany({
        user: decoded.id,
        revoked: false
    }, {

        revoked: true
    })
    resp.clearCookie('refreshtoken')
    resp.status(200).json({
        message: "user logged out from all devices"
    })
}