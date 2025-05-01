import { Project } from "../models/project.model.js";
import {Task} from '../models/task.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const {ObjectId} = mongoose.Types



export const createTask = async(req, res, next) => {
    try {
        const {projectId} = req.params;
        const {title, description, status} = req.body;
        if(!title || !description) {
            return next(new ApiError(400, "Title and description is required"))
        
        }
        
        const project = await Project.findById(projectId)
        if(!project) {
            return next(new ApiError(404, `No project with id:${projectId}`))
        }
        if(project.user.toString() !== req.user._id.toString()) {
            return next(new ApiError(401, `User ${req.user._id} is not authorized to add a task to project ${projectId} `))
        }

        const task = await Task.create({title, description, status, project:projectId, user:req.user._id})
        return res.status(201).json(new ApiResponse(true, "Task created successfully", {task}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}


export const getAllTasks = async(req, res, next)=> {
    try {
        const {projectId} = req.params;
        const project = await Project.findById(projectId)
        if(!project) {
            return next(new ApiError(404, "Project not found"))
        }
        if(project.user.toString() !== req.user._id.toString()) {
            return next(new ApiError(400, "You can not see this project"))
        }

        const tasks = await Task.find({project:new ObjectId(projectId), user:req.user._id}).populate({path:'project', select:'name'})
        return res.status(200).json(new ApiResponse(true, "Tasks fetched successfully", {tasks}))
    } catch (error) {
        console.error(error)

    }
}


export const readTask = async(req, res, next) => {
    try {
        const {taskId} = req.params;
        const task = await Task.findOne({_id:taskId, user:req.user._id}).populate({path:"project", select:"name"})
        if(!task) {
            return next(new ApiError(404, `No task with the id:${taskId}`))

        }
        return res.status(200).json(new ApiResponse(true, "Task fetched successfully", {task}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}


export const updateTask = async(req, res, next) => {
    try {
        const {taskId} = req.params;
        let task = await Task.findById(taskId)
        if(!task) {
            return next(new ApiError(404, `No task with id:${taskId}`))
        }

        if(task.user.toString() !== req.user._id.toString()){
            return next(new ApiError(401, `User ${req.user._id} is not authorized to update task:${taskId}`))
        }

        task = await Task.findByIdAndUpdate(taskId, req.body, {
            new:true,
            runValidators:true
        })
        await task.save()  
        return res.status(200).json(new ApiResponse(true, "Task updated successfully", {task}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}




export const deleteTask = async(req, res, next) => {
    try {
        const {taskId} = req.params;
        const task = await Task.findById(taskId);
        if(!task) {
            return next(new ApiError(404, `No task with id:${taskId}`))
        }
        if(task.user.toString() !== req.user._id.toString()){
            return next(new ApiError(401, `User ${req.user._id} is not authorized to update task:${taskId}`))
        }
        await Task.findByIdAndDelete(taskId)
        return res.status(200).json(new ApiResponse(true, "Task deleted successfully", {}))
    } catch (error) {
        console.error(error)
        next(error)
    }
}