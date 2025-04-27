import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["todo", "inprogress", "completed"], 
    default: "todo" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to User model
  //   required: true
  // }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;