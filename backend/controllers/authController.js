const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username) {
        return res.status(400).json({ message: "The username is missing" })
    } else if (!password) {
        return res.status(400).json({ message: "The Password is missing" })
    }

    const findUser = await User.findOne({ username }).exec()

    if (!findUser || !findUser.active) {
        return res.status(401).json({ message: "The username is missing or inactive" })
    }

    const match = await bcrypt.compare(password, findUser.password)

    if (!match) {
        return res.status(401).json({ message: "Your password does not match" })
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": findUser.username,
                "roles": findUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
        { "username": findUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    // creating a secure cookie with refresh token
    res.cookie('jwt',refreshToken,{
        httpOnly:true,//only accessible in a web browser
        secure:false,//https
        sameSite:'None', //cross-site cookie  
        maxAge:7*24*60*60*1000
    })

    //send accessToken containing username and roles
    res.json({accessToken})


})

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
    const cookies=req.cookies
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const refreshToken=cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err,decoded)=>{
            if (err) {
                return res.status(403).json({ message: "Forbidden" })
            }
            const findUser = await User.findOne({ username:decoded.username }).exec()
            
            if (!findUser) {
                return res.status(403).json({ message: "Unauthorized!" })
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": findUser.username,
                        "roles": findUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            )

            res.json({ accessToken})

        })
    )
})

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
    const cookies=req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) //no content
    }

    res.clearCookie('jwt',{httpOnly: true, sameSite:'None',secure:false})

    res.json({message:'cookie cleared'})
})

module.exports = {
    login,
    refresh,
    logout
}