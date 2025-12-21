import Developer from "../models/Task_schema.js";
import User from "../models/Admin_schema.js";

const assignTask = async(req,resp)=>{
    const {userid,title, dis, dueDate, status} = req.body;

    const dev = await Developer.findById(userid)
    if(!dev){
        return resp.status(404).json({message:"not found develoer", success:false})
    }

    dev.task.push({title,dis,dueDate,status});
    await dev.save();
    return resp.status(200).json({message:"task assign successfully",success:true})
    
}

const fetchTask = async(req,resp)=>{
    const {userid} = req.params;
    console.log(userid)

    try {
         let user = await User.findById(userid)
    if(!user){
        user = await Developer.findById(userid);
    }

    if(!user){
        return resp.status(404).json({message:"not found user",success:false})
        
    }
     
    if(user.role==='admin'){
         const task = await Developer.find()
         return resp.status(200).json({message:"all assign task",success:true,data:task})
    }

    if(user.role==='developer'){
        const mytask = await Developer.findById(user._id)
        return resp.status(200).json({message:"my assing task",success:true, data:mytask})
    }
    } catch (error) {
        resp.status(500).json({message:"server error",success:false,error})
        console.log(error)
    }

   


}


const updateStatus = async(req, resp)=>{

       const {taskid} = req.params;
       const {userid} = req.body;
try {
      const isDev = await Developer.findById(userid)

       if(!isDev){
           return resp.status(404).json({message:"developer not found",success:false})
       }
      
       const isTask = isDev.task.id(taskid);
       if(!isTask){
        return resp.status(404).json({message:"not task found",success:false})
       }

       isTask.status = 'completed'
       await isDev.save();
       return resp.status(200).json({message:"satatus updated succesfully",success:true, data:isTask})
} catch (error) {
    console.log(error)
    return resp.status(500).json({message:"server error",success:false})
}
     
}

const removeTask = async (req, res) => {
    try {
        const { taskid } = req.params;
        const { userid } = req.body;

        console.log("Removing task:", { taskid, userid });

        if (!taskid || !userid) {
            return res.status(400).json({
                message: "Task ID and User ID are required",
                success: false
            });
        }


        const developer = await Developer.findById(userid);

        if (!developer) {
            return res.status(404).json({
                message: "Developer not found",
                success: false
            });
        }

   
        if (!developer.task || developer.task.length === 0) {
            return res.status(404).json({
                message: "Developer has no tasks",
                success: false
            });
        }

      
        const taskIndex = developer.task.findIndex(task => 
            task._id.toString() === taskid
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Task not found for this developer",
                success: false
            });
        }

        const removedTask = developer.task[taskIndex];

        developer.task.splice(taskIndex, 1);

        await developer.save();

        return res.status(200).json({
            message: "Task removed successfully",
            success: true,
            data: removedTask
        });

    } catch (error) {
        console.error("Error removing task:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid ID format",
                success: false
            });
        }
        
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message
        });
    }
};

export {assignTask,fetchTask,updateStatus,removeTask };