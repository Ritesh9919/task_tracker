import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

export const signup = async(req, res, next)=> {
    try {
        const {name, email, password, country} = req.body;
        if(!name || !email || !password || !country) {
            return next(new ApiError(400, "All fields are required"))
        }
        const user = await User.findOne({email})
        if(user) {
            return next(new ApiError(400, "User already exists"))
        }

        const newUser = await User.create({name, email, password, country})
        const registeredUser = await User.findById(newUser._id).select("-password")
        return res.status(201).json(new ApiResponse(true, "User registered successfully", {user:registeredUser}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}


export const login = async(req, res, next)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new ApiError(400, "Both fields are required"))
        }
        const user = await User.findOne({email});
        if(!user) {
            return next(new ApiError(404, "User not found"))
        }
        const isMatch = await user.comparePassword(password)
        
        if (!isMatch) {
            return next(new ApiError(400, "Invalid credentials"))
        }
        const loginUser = await User.findById(user._id).select('-password')
        const token = user.generateAuthToken()
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        res.cookie('token',token, {
            httpOnly:true,
            secure: process.env.NODE_ENV == 'production',
            expires:expiryDate,
            maxAge: 24 * 60 * 60 * 1000,
            path:'/',
            domain:process.env.NODE_ENV == 'production'? 'https://task-tracker-12mern.netlify.app/':'localhost'

            
            

        })
        return res.status(200).json(new ApiResponse(true, "User logged in successfully", {user:loginUser}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}


export const logout = async(req, res, next)=> {
    try {
        res.clearCookie("token", {
            httpOnly:true,
            secure: process.env.NODE_ENV == 'production',
            path:'/',
            domain:'localhost'
        
        })
        return res.status(200).json(new ApiResponse(true, "User logged out successfully", {}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}