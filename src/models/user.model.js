import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reuired:true
    },
    email:{
        type:String,
        reuired:true,
        unique:true
    },
    password:{
        type:String,
        reuired:true
    },
    country:{
        type:String,
        reuired:true
    }

},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)  
    next() 
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAuthToken = function() {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRY})
    
}


export const User = mongoose.model("User", userSchema)