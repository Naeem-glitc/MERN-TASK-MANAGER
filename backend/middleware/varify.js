import Admin from "../models/Admin_schema.js";
import Developer from "../models/Task_schema.js";
import bcrypt from "bcryptjs";

const Varify_Admin = async(req, res, next)=>{
    console.log(req.body)
 const   {email, password} = req.body;

 let user =await Admin.findOne({email: email});
 if(!user){
     user = await Developer.findOne({email: email})
 } 
 
const isPasswordMatch = await bcrypt.compare(password,user.password);
if(!isPasswordMatch){
    res.status(401).json({message:"Invalid credentials",success:false})
}

next()

}

export default Varify_Admin;