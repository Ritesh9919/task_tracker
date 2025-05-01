import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'



const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


projectSchema.pre("save", async function(next){
    const projectsCount = await this.model("Project").countDocuments({user:this.user})
    if (projectsCount >= 4) {
        return next(new ApiError(400, 'User can only have up to 4 projects'));
      }
    
      next();
})



export const Project = mongoose.model("Project", projectSchema)