import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudents } from '../context/StudentContext'
import { majorOptions } from '../data/mockStudents'

export default function CreatePeerModal({ searchQuery, isEmailSearch, onClose }) {
  const navigate = useNavigate()
  const { addStudent } = useStudents()

  // Pre-populate based on search type
  const initialFormData = useMemo(() => {
    if (isEmailSearch) {
      return {
        firstName: '',
        lastName: '',
        email: searchQuery,
        major: '',
      }
    } else {
      // Split name search into first and last name
      const parts = searchQuery.trim().split(/\s+/)
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || ''
      return {
        firstName,
        lastName,
        email: '',
        major: '',
      }
    }
  }, [searchQuery, isEmailSearch])

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [duplicateFound, setDuplicateFound] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    // Clear duplicate message when email is changed
    if (name === 'email') {
      setDuplicateFound(null)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'School email is required'
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.edu$/)) {
      newErrors.email = 'Email must be in format: name@school.edu'
    }

    if (!formData.major) {
      newErrors.major = 'Major/Field of Study is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newStudent = await addStudent({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        major: formData.major,
      })

      // Close modal and navigate to review page
      onClose()
      navigate(`/student/${newStudent.id}/review`)
    } catch (error) {
      if (error.status === 409 && error.data?.student) {
        setDuplicateFound(error.data.student)
      } else {
        console.error('Error creating student profile:', error)
        setErrors({ submit: 'Failed to create profile. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Student Profile</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-peer-form">
          {duplicateFound && (
            <div className="duplicate-message">
              <p>
                <strong>This student already has a profile!</strong> This email
                is already registered in the system.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose()
                  navigate(`/student/${duplicateFound.id}`)
                }}
              >
                View Existing Profile
              </button>
            </div>
          )}

          {!duplicateFound && (
            <>
              {errors.submit && (
                <div className="error-message" style={{ marginBottom: '1rem' }}>
                  {errors.submit}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && (
                  <span className="error-text">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && (
                  <span className="error-text">{errors.lastName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  School Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@university.edu"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="major">
                  Major/Field of Study <span className="required">*</span>
                </label>
                <select
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className={errors.major ? 'input-error' : ''}
                >
                  <option value="">Select a major...</option>
                  {majorOptions.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
                {errors.major && (
                  <span className="error-text">{errors.major}</span>
                )}
              </div>

              <div className="privacy-disclaimer">
                <p>
                  <strong>Privacy Notice:</strong> This profile will be public.
                  Ensure the information matches the student's official
                  university directory.
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
