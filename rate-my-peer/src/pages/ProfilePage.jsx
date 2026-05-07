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
  const { getStudentById, loggedInUserId, addReview } = useStudents()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewFormData, setReviewFormData] = useState({
    course: '',
    rating: 0,
    comment: '',
    attributes: [],
    verified: false,
  })

  const student = getStudentById(studentId)
  const reviews = pullReviewsGivenRevieweeId(studentId)

  if (!student) {
    return <p className="empty-state">Student profile not found.</p>
  }

  // Check if viewing own profile or someone else's
  const isOwnProfile = loggedInUserId === studentId

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

  const handleReviewChange = (field, value) => {
    setReviewFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAttributeToggle = (attribute) => {
    setReviewFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.includes(attribute)
        ? prev.attributes.filter((attr) => attr !== attribute)
        : [...prev.attributes, attribute],
    }))
  }

  const handleRatingChange = (newRating) => {
    setReviewFormData((prev) => ({
      ...prev,
      rating: newRating,
    }))
  }

  const handleSubmitReview = () => {
    addReview({
      studentId,
      course: reviewFormData.course,
      rating: reviewFormData.rating,
      comment: reviewFormData.comment,
      attributes: reviewFormData.attributes,
      isAnonymous: false,
    })

    // Reset form and close modal
    setReviewFormData({
      course: '',
      rating: 0,
      comment: '',
      attributes: [],
      verified: false,
    })
    setShowReviewModal(false)
  }

  const isReviewFormValid =
    reviewFormData.course &&
    reviewFormData.rating > 0 &&
    reviewFormData.verified

  // Reviews Received - filter reviews by type
  const reviewsReceived = reviews

  // Reviews Given - would need to be fetched from user's written reviews
  const reviewsGiven = []

  return (
    <section className="page profile-page">
      {/* Profile Header */}
      <div className="profile-header-section">
        <h1 className="profile-greeting">
          {isOwnProfile ? `Hey, ${student.firstName} 👋` : `${student.firstName} ${student.lastName}`}
        </h1>
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
        {/* Only show Account Settings tab for own profile */}
        {isOwnProfile && (
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Account Settings
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section className="panel profile-panel">
            <div className="profile-panel-header">
              <h2>Profile Information</h2>
              {/* Only show Edit button for own profile */}
              {isOwnProfile && (
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  ✏️ {isEditing ? 'Cancel' : 'Edit'}
                </button>
              )}
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

                {/* Only show graduation year for own profile */}
                {isOwnProfile && (
                  <div className="profile-row">
                    <div className="profile-field">
                      <label>Expected Year of Graduation</label>
                      <p>{student.graduationYear}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {/* Rate this Peer Button - Only show if not viewing own profile */}
            {!isOwnProfile && (
              <div className="review-action-container">
                <button
                  className="rate-button"
                  onClick={() => setShowReviewModal(true)}
                >
                  ✏️ Rate {student.firstName}
                </button>
              </div>
            )}

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
                      <ReviewCard key={review.id} review={review} currentUserId={loggedInUserId}/>
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
                    <ReviewCard key={review.id} review={review} currentUserId={loggedInUserId} />
                  ))}
                </div>
              ) : (
                <p className="muted">You haven't written any reviews yet.</p>
              )}
            </section>

            {/* Review Modal */}
            {showReviewModal && (
              <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Submit Review for {student.firstName} {student.lastName}</h2>
                    <button
                      className="modal-close"
                      onClick={() => setShowReviewModal(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="modal-body">
                    {/* Course Selection */}
                    <div className="form-group">
                      <label htmlFor="course">Course *</label>
                      <input
                        id="course"
                        type="text"
                        placeholder="e.g., CS124, CS220"
                        value={reviewFormData.course}
                        onChange={(e) =>
                          handleReviewChange('course', e.target.value)
                        }
                        list="courseList"
                      />
                      <datalist id="courseList">
                        <option value="CS101" />
                        <option value="CS124" />
                        <option value="CS220" />
                        <option value="ENG200" />
                        <option value="MATH200" />
                        <option value="STAT310" />
                      </datalist>
                    </div>

                    {/* Star Rating */}
                    <div className="form-group">
                      <label>Star Rating *</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`star-button ${
                              star <= reviewFormData.rating ? 'active' : ''
                            }`}
                            onClick={() => handleRatingChange(star)}
                            type="button"
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      {reviewFormData.rating > 0 && (
                        <p className="rating-display">
                          {reviewFormData.rating} out of 5 stars
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div className="form-group">
                      <label htmlFor="comment">Comments</label>
                      <textarea
                        id="comment"
                        placeholder="Share your experience working with this student..."
                        value={reviewFormData.comment}
                        onChange={(e) =>
                          handleReviewChange('comment', e.target.value)
                        }
                        rows={4}
                      />
                    </div>

                    {/* Attributes Selection */}
                    <div className="form-group">
                      <label>Select Attributes</label>
                      <div className="chip-grid">
                        {['On Time', 'Leader', 'Absent', 'Strong Coder', 'Good Communicator', 'Hard Worker'].map((attr) => (
                          <button
                            key={attr}
                            className={`chip ${
                              reviewFormData.attributes.includes(attr)
                                ? 'selected'
                                : ''
                            }`}
                            onClick={() => handleAttributeToggle(attr)}
                            type="button"
                          >
                            {attr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verification Checkbox */}
                    <div className="form-group">
                      <label className="verification-checkbox">
                        <input
                          type="checkbox"
                          checked={reviewFormData.verified}
                          onChange={(e) =>
                            handleReviewChange('verified', e.target.checked)
                          }
                        />
                        <span>
                          I verify that I worked with this student on a group
                          project.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="cancel-button"
                      onClick={() => setShowReviewModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`submit-button ${
                        isReviewFormValid ? '' : 'disabled'
                      }`}
                      onClick={handleSubmitReview}
                      disabled={!isReviewFormValid}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Settings Tab - Only for own profile */}
        {isOwnProfile && activeTab === 'settings' && (
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

