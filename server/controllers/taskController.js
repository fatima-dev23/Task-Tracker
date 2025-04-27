// import Task from '../models/Tasks.js';

// // @desc    Create new task
// // @route   POST /api/tasks
// // @access  Private
// export const createTask = async (req, res) => {
//   try {
//     const task = await Task.create({
//       ...req.body,
//       createdBy: req.user._id // From auth middleware
//     });
    
//     res.status(201).json({
//       success: true,
//       data: task
//     });
    
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get all tasks
// // @route   GET /api/tasks
// // @access  Private
// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find()
//       .populate('createdBy', 'username email')
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: tasks.length,
//       data: tasks
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Get single task
// // @route   GET /api/tasks/:id
// // @access  Private
// export const getTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('createdBy', 'username email');
    
//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         error: 'Task not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: task
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Update task
// // @route   PUT /api/tasks/:id
// // @access  Private
// export const updateTask = async (req, res) => {
//   try {
//     let task = await Task.findById(req.params.id);
    
//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         error: 'Task not found'
//       });
//     }
    
//     // Verify task ownership (unless admin)
//     if (task.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
//       return res.status(401).json({
//         success: false,
//         error: 'Not authorized to update this task'
//       });
//     }
    
//     task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
    
//     res.status(200).json({
//       success: true,
//       data: task
//     });
    
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Delete task
// // @route   DELETE /api/tasks/:id
// // @access  Private
// export const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
    
//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         error: 'Task not found'
//       });
//     }
    
//     // Verify task ownership (unless admin)
//     if (task.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
//       return res.status(401).json({
//         success: false,
//         error: 'Not authorized to delete this task'
//       });
//     }
    
//     await task.remove();
    
//     res.status(200).json({
//       success: true,
//       data: {}
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Get tasks by status
// // @route   GET /api/tasks/status/:status
// // @access  Private
// export const getTasksByStatus = async (req, res) => {
//   try {
//     const tasks = await Task.find({ status: req.params.status })
//       .populate('createdBy', 'username email');
    
//     res.status(200).json({
//       success: true,
//       count: tasks.length,
//       data: tasks
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };