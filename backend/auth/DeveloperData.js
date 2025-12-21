import Developer from "../models/Task_schema.js";

const getAllDeveloper = async(req, resp)=>{
    try {
        const allDeveloper = await Developer.find();
    if(allDeveloper.length === 0){
       return resp.status(200).json({message:"No developer availabale",success:true, data:[]})
    }

    resp.status(200).json({message:"all developer feteched",success:true, data:allDeveloper})
    } catch (error) {
        resp.status(500).json({message: 'Internal server error', success:false} );
    }
    
};

export default getAllDeveloper;