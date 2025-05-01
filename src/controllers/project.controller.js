
import {Project} from '../models/project.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'



export const createProject = async(req, res, next)=> {
    try {
        const {name} = req.body

        if(!name) {
            return next(new ApiError(400, "Name is required"))
        }

        const project = await Project.create({name, user:req.user._id})
        return res.status(201).json(new ApiResponse(true, "Project created successfully", {project}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}



export const getProjects = async(req,res,next)=> {
    try {
        const projects = await Project.find({user:req.user._id})
        return res.status(200).json(new ApiResponse(true, "Projects fetched successfully", {projects}))
    } catch (error) {
        console.error(error)
        next(error)
    }

}