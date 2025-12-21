import Developer from "../models/Task_schema.js";
import bcrypt from "bcryptjs";



const create_Developer = async (req, resp)=>{

    const body = {...req.body};
    console.log('Developer account request:', body);
    const {name, email, password, role}= body;
    if (!name || !email|| !password|| !role){
        return resp.status(400).json({message: 'All fields are required', success: false});
    }

    try {
        const existingDeveloper = await Developer.findOne({email});
        if(existingDeveloper){
            return resp.status(400).json({message: 'Developer already access already exists', success: false});
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);
       
        const newDeveloper = new Developer({
        name,
        email,
        password: hashedPassword,
        role
       
    });
       
      await newDeveloper.save();


    } catch (error) {
        console.error(error)
        resp.status(500).json({message: 'Internal server error', success: false});
    }

}


export default create_Developer;
