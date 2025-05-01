import mongoose from "mongoose";



const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxLength:100
    },
    description:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
      },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      completedAt: {
        type: Date,
      },  

})


taskSchema.post('findOneAndUpdate', async function(doc) {
  if (doc.status === 'completed' && !doc.completedAt) {
    doc.completedAt = Date.now();
    await doc.save();
  }
});

// taskSchema.pre('save', function (next) {
  
//     if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
//       console.log("Inside hook")
//       this.completedAt = Date.now();
//     }
//     next();
//   });
export const Task = mongoose.model("Task", taskSchema)