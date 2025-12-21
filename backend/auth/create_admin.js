import User from "../models/Admin_schema.js";
import bcrypt from "bcryptjs";



const create_admin = async (req, resp)=>{

    const body = {...req.body};
    console.log('Received signup request:', body);
    const {name, email, password, role}= body;
    if (!name || !email|| !password|| !role){
        return resp.status(400).json({message: 'All fields are required', success: false});
    }

    try {
        const existingAdmin = await User.findOne({email});
        if(existingAdmin){
            return resp.status(400).json({message: 'Admin already exists', success: false});
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);
       
        const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role
       
    });
       
      await newAdmin.save();


    } catch (error) {
        console.error(error)
        resp.status(500).json({message: 'Internal server error', success: false});
    }

}


export default create_admin;
