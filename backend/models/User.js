import mongoose from 'mongoose'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    select: false,
    
  },
  refreshToken: {
    type : String,
    select : false
  },
  resetPasswordToken: {
  type: String,
  select: false
},
resetPasswordExpires: {
  type: Date,
  select: false
}
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User