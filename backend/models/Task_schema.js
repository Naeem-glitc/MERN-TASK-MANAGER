import mongoose from "mongoose";

const task_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    dis: {
        type: String,
        required: true,
        trim: true
    },

    dueDate: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        required:true
    }


});


const Developer_schema = new mongoose.Schema({
     name: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  role: {
    type: String,
    required: true
   
  },

  task:[task_schema]
}) 

const Developer = mongoose.model("Developer",Developer_schema);
export default Developer

