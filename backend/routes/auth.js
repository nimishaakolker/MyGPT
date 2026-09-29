import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { authLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validator.js'
import { signupSchema, loginSchema } from '../validators/authValidator.js'
import protect  from '../middleware/auth.js'
import crypto from 'crypto'

const router = express.Router()

router.post('/signup', authLimiter, validate(signupSchema), async (req, res) => {
  const { email, password} = req.body;

  if (!email || !password)  return res.status(400).json({message : "Missing fields"});

  if (password.length < 8) {
  return res.status(400).json({ message: 'Password must be at least 8 characters' })
}

  const isEmailAlreadyExist = await User.findOne({email});

  if(isEmailAlreadyExist) {
    return res.status(409).json({
        message : ("Email already exists")
    })
  }

  const hasedPassword = await bcrypt.hash(password, 10);

  const newUser = await   User.create({
    email : email,
    password : hasedPassword
  })

  return res.status(201).json({
    message : 'Signup successful',
    email : email
  })
})

router.post('/login', authLimiter,validate(loginSchema) ,async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' })
  }


  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }


const accessToken = jwt.sign(
    { id : user._id},
    process.env.JWT_SECRET,
    { expiresIn: '15m'}
)

const refreshToken = jwt.sign(
    {id : user._id},
    process.env.JWT_REFRESH_SECRET,
    { expiresIn : '7d'}
)


user.refreshToken = refreshToken
await user.save()

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod, allows http on localhost dev
  sameSite: 'strict', // cookie won't be sent on cross-site requests, blocks CSRF-style abuse
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
})

return res.status(200).json({
    message : 'Login successful', accessToken,
    email: user.email
})
})

router.post('/refresh', async(req, res) => {
    const refreshToken = req.cookies.refreshToken

   if(!refreshToken){
    return res.status(401).json({message : 'No refresh token'})
   } 

   try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const user = await User.findById(decoded.id).select('+refreshToken');

    if(!user || user.refreshToken !== refreshToken){
        return res.status(401).json({message : 'Invalid refresh token'})
    }


    const newAccessToken = jwt.sign(
        { id : user._id},
        process.env.JWT_SECRET,
        {expiresIn : '15m'}
    )

    return res.status(200).json({ accessToken : newAccessToken})
   } catch (error) {
    return res.status(401).json({message : 'Invalid or expired refresh token'})
   }
})

router.post('/logout', protect, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId)

  user.refreshToken = null;
  await user.save();

  res.clearCookie('refreshToken');

  return res.status(200).json({ message: 'Logged out successfully' })

})


router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(200).json({ message: 'If that email exists, a reset link has been sent' })
  }

  // Generate a random token — this is what gets emailed to the user
  const resetToken = crypto.randomBytes(32).toString('hex')

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  user.resetPasswordToken = hashedToken
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000 
  await user.save()


  const resetLink = `http://localhost:5173/reset-password/${resetToken}`
  console.log('RESET LINK (would be emailed):', resetLink)

  return res.status(200).json({ message: 'If that email exists, a reset link has been sent' })
})


router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, newPassword } = req.body

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' })
  }
  
  const hasedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hasedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    message : 'Password reset successfully'
  })

})
export default router
