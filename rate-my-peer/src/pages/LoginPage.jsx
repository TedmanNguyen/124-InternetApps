import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStudents } from '../context/StudentContext'
import './LoginPage.css'

const MIN_PASSWORD_LENGTH = 8
const EDU_EMAIL = /^[^\s@]+@[^\s@]+\.edu$/i

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, currentUser, authChecked } = useStudents()

  // Where to send the user after a successful login (defaults to home).
  const redirectTo = location.state?.from?.pathname || '/'

  const [submitting, setSubmitting] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const validateEmail = (email) => {
    return EDU_EMAIL.test(email.trim())
  }

  const validateLoginForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use your university email (.edu)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

  const validateSignUpForm = () => {
    const newErrors = {}

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use your university email (.edu)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = isLogin ? validateLoginForm() : validateSignUpForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        })
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // Already signed in? Don't show the login form — bounce to where they were headed.
  if (authChecked && currentUser) {
    return <Navigate to={redirectTo} replace />
  }


  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Branding */}
        <div className="login-branding">
          <h1 className="login-logo">Rate My Peer</h1>
          <p className="login-tagline">Find your next A-Team</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Sign Up Fields */}
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </>
          )}

          {/* Email Field (Both forms) */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password Field (Both forms) */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field (Sign Up only) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          {errors.submit && (
            <span className="error-message">{errors.submit}</span>
          )}

          {/* Action Button */}
          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Please wait…' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>


        {/* Toggle Link */}
        <div className="toggle-link">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false)
                  setErrors({})
                }}
                className="toggle-button"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true)
                  setErrors({})
                }}
                className="toggle-button"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
