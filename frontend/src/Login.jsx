import React, { useState, useContext } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { MyContext } from './MyContext'

const Login = ({ switchToSignup }) => {
  const { setAccessToken } = useContext(MyContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      setAccessToken(data.accessToken)
      setLoading(false)

    } catch (err) {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen flex items-center justify-center bg-[#212121]'>
      <form
        onSubmit={handleSubmit}
        className='bg-[#2f2f2f] shadow-2xl shadow-black/50 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4'
      >
        <h1 className='text-2xl font-semibold text-center mb-2'>Welcome back!</h1>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='sr-only'>Email</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            required
            className='p-3 rounded-lg bg-[#424242] text-[#ececec] placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='password' className='sr-only'>Password</label>
          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              required
              className='p-3 pr-10 w-full rounded-lg bg-[#424242] text-[#ececec] placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='button'
              onClick={() => setShowPassword(prev => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className='text-red-400 text-sm text-center -mt-2'>{error}</p>
        )}

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors p-3 rounded-lg font-medium mt-2'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='text-sm text-center text-gray-400'>
          Don't have an account?{' '}
          <span onClick={switchToSignup} className='text-blue-400 cursor-pointer hover:underline'>Sign up</span>
        </p>
      </form>
    </div>
  )
}

export default Login