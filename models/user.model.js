import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: [true, 'Please provide your name'],
        trim: true,
        minLength: 5,
        macLength: 50,
    },
    email : {
        type : String,
        required: [true, 'please provide your email'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please provide a valid email'
        ],
    },
    password:{
        type : String,
        required: [true, 'Please provide a password'],
        minLength : 8,
    },
        
        
} , {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;

