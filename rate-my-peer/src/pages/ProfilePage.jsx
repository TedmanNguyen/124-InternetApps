import { useState } from 'react'
import { useParams } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import { useStudents } from '../context/StudentContext'
import {
  getAggregateRating,
  getCourseBreakdown,
  getDisplayName,
} from '../utils/studentMetrics'
import ReviewCard from '../components/ReviewCard'
import { pullReviewsGivenRevieweeId } from '../data/mockReviews'
import './ProfilePage.css'

export default function ProfilePage() {
  const { studentId } = useParams()
  const { getStudentById } = useStudents()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)

  const student = getStudentById(studentId)
  const reviews = pullReviewsGivenRevieweeId(studentId)

  if (!student) {
    return <p className="empty-state">Student profile not found.</p>
  }

  if (formData === null) {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      school: student.school,
      major: student.major,
      graduationYear: student.graduationYear,
    })
  }

  const aggregateRating = getAggregateRating(student)
  const courseBreakdown = getCourseBreakdown(student)

  const handleEditChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // TODO: Save to backend
  }

  const handleCancelEdit = () => {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      school: student.school,
      major: student.major,
      graduationYear: student.graduationYear,
    })
    setIsEditing(false)
  }

  // Reviews Received - filter reviews by type
  const reviewsReceived = reviews

  // Reviews Given - would need to be fetched from user's written reviews
  const reviewsGiven = []

  return (
    <section className="page profile-page">
      {/* Profile Header */}
      <div className="profile-header-section">
        <h1 className="profile-greeting">Hey, {student.firstName} 👋</h1>
        <RatingStars
          rating={aggregateRating}
          totalReviews={student.reviews.length}
          size="lg"
        />
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Account Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section className="panel profile-panel">
            <div className="profile-panel-header">
              <h2>Profile Information</h2>
              <button
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                ✏️ {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleEditChange('firstName', e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleEditChange('lastName', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>School</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) =>
                        handleEditChange('school', e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study (Major)</label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => handleEditChange('major', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Expected Year of Graduation</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      handleEditChange('graduationYear', e.target.value)
                    }
                  />
                </div>

                <div className="form-actions">
                  <button className="save-button" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="profile-row">
                  <div className="profile-field">
                    <label>First Name</label>
                    <p>{student.firstName}</p>
                  </div>
                  <div className="profile-field">
                    <label>Last Name</label>
                    <p>{student.lastName}</p>
                  </div>
                </div>

                <div className="profile-row">
                  <div className="profile-field">
                    <label>School</label>
                    <p>{student.school}</p>
                  </div>
                  <div className="profile-field">
                    <label>Field of Study (Major)</label>
                    <p>{student.major}</p>
                  </div>
                </div>

                <div className="profile-row">
                  <div className="profile-field">
                    <label>Expected Year of Graduation</label>
                    <p>{student.graduationYear}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {/* Reviews Received */}
            <section className="panel reviews-subsection">
              <h2>Reviews Received</h2>
              {reviewsReceived.length > 0 ? (
                <div>
                  <div className="aggregate-score">
                    <p>
                      Overall Peer Rating:{' '}
                      <strong>{aggregateRating.toFixed(1)}/5</strong>
                    </p>
                  </div>
                  <div className="review-list">
                    {reviewsReceived.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="muted">No reviews received yet.</p>
              )}
            </section>

            {/* Reviews Given */}
            <section className="panel reviews-subsection">
              <h2>Reviews Given</h2>
              {reviewsGiven.length > 0 ? (
                <div className="review-list">
                  {reviewsGiven.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="muted">You haven't written any reviews yet.</p>
              )}
            </section>
          </div>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'settings' && (
          <section className="panel settings-panel">
            <div className="settings-section">
              <h3>Security</h3>
              <button className="setting-button">Change Password</button>
              <button className="setting-button">
                Manage Multi-Factor Authentication
              </button>
            </div>

            <div className="settings-section">
              <h3>Notifications</h3>
              <label className="toggle-option">
                <input type="checkbox" defaultChecked />
                <span>Alert me when I receive a new review</span>
              </label>
              <label className="toggle-option">
                <input type="checkbox" defaultChecked />
                <span>Alert me when someone likes my review</span>
              </label>
            </div>

            <div className="settings-section">
              <h3>Privacy</h3>
              <label className="toggle-option">
                <input type="checkbox" />
                <span>Hide my expected graduation year from search results</span>
              </label>
              <label className="toggle-option">
                <input type="checkbox" />
                <span>Hide my major from search results</span>
              </label>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

