import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

// Mock auth API call
async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) {
    throw new Error('Login failed')
  }
  return response.json()
}

function AuthPage() {
  // ✅ All hooks are declared first, before any conditional logic or early returns.
  // This fixes the "Rendered fewer hooks than expected" error caused by
  // hooks being placed after a conditional early return.
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isMobile, setIsMobile] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // ✅ Using addEventListener instead of the deprecated addListener.
  // MediaQueryList.addListener() was removed in modern browsers and caused
  // "Cannot read properties of undefined (reading 'addListener')".
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    function handleMediaChange(event) {
      setIsMobile(event.matches)
    }

    // Set initial value
    setIsMobile(mediaQuery.matches)

    // ✅ Use addEventListener (modern API) instead of deprecated addListener
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  const { mutate: login, isPending, isError, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: (err) => {
      setErrorMessage(err.message)
    },
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    login(formData)
  }

  return (
    <div style={{ maxWidth: isMobile ? '100%' : '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>

      {(errorMessage || isError) && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage || error?.message || 'Authentication failed'}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Please wait…' : isLogin ? 'Sign In' : 'Register'}
        </button>
      </form>

      <button type="button" onClick={() => setIsLogin((prev) => !prev)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Sign In'}
      </button>
    </div>
  )
}

export default AuthPage
