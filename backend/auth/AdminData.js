import User from "../models/Admin_schema.js";
import jwt from "jsonwebtoken"
import Developer from "../models/Task_schema.js";

const AuthorizeAdmin = async(req,res)=>{
    try {
         const {email}= req.body;
     let user = await User.findOne({email:email});
    if(!user){
        user = await Developer.findOne({email:email})
    }

   const token = jwt.sign({id:user._id,email:user.email, role:user.role},process.env.JWT_SECRET,{expiresIn: '1d'})
   res.status(200).json({message:"successfuly Login", data:user,token:token, success:true})
   console.log(user)
    } catch (error) {
        console.error(error);
    }
   
};

const FeatchAdmin = async(req, resp)=>{
    const {id} = req.params;
    try {
        const adminData = await Admin.findById(id)
        if(!adminData){
            resp.status(404).json({message:"no admin found", success:false})
        }
        console.log(adminData)
        resp.status(200).json({message:"admin found", data:adminData,success:true,})
    } catch (error) {
        console.error(error)
        resp.status(500).json({message:"server error", error})

    }
}

export  {AuthorizeAdmin,FeatchAdmin}