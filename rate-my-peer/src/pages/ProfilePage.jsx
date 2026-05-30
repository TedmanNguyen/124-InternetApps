import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import { useStudents } from '../context/StudentContext'
import { useReviews } from '../context/ReviewContext'
import { api } from '../api/client'
import { getAggregateRating, getCourseBreakdown } from '../utils/studentMetrics'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import './ProfilePage.css'

export default function ProfilePage() {
  const { studentId } = useParams()
  const { loggedInUserId, getStudentById, refreshStudents } = useStudents()
  const { fetchReviewsForStudent, fetchReviewsGivenBy, createReview } = useReviews()

  const [student, setStudent] = useState(getStudentById(studentId) || null)
  const [reviewsReceived, setReviewsReceived] = useState([])
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const isOwnProfile = loggedInUserId === studentId

  // Load student + reviews when the URL id changes.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      api.students.get(studentId).then((r) => r.student),
      fetchReviewsForStudent(studentId),
      isOwnProfile ? fetchReviewsGivenBy(studentId) : Promise.resolve([]),
    ])
      .then(([studentData, received, given]) => {
        if (cancelled) return
        setStudent(studentData)
        setReviewsReceived(received)
        setReviewsGiven(given)
        setFormData({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          school: studentData.school,
          major: studentData.major,
          graduationYear: studentData.graduationYear,
        })
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [studentId, isOwnProfile, fetchReviewsForStudent, fetchReviewsGivenBy])

  if (loading) return <p className="empty-state">Loading profile…</p>
  if (error) return <p className="empty-state">{error}</p>
  if (!student) return <p className="empty-state">Student profile not found.</p>

  const aggregateRating = getAggregateRating(reviewsReceived)
  const courseBreakdown = getCourseBreakdown(reviewsReceived)

  const handleEditChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSaveProfile = async () => {
    try {
      const { student: updated } = await api.students.update(student.id, formData)
      setStudent(updated)
      setIsEditing(false)
      refreshStudents().catch(() => {})
    } catch (e) {
      alert(e.message)
    }
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

  const handleSubmitReview = async (data) => {
    try {
      const review = await createReview({
        revieweeId: studentId,
        course: data.course,
        instructor: data.instructor,
        project: data.project,
        rating: data.rating,
        comment: data.comment,
        attributes: data.attributes,
        isAnonymous: data.isAnonymous,
        wouldWorkWithAgain: data.wouldWorkWithAgain,
      })
      setReviewsReceived((prev) => [review, ...prev])
      setShowReviewModal(false)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <section className="page profile-page">
      <div className="profile-header-section">
        <h1 className="profile-greeting">
          {isOwnProfile ? `Hey, ${student.firstName} 👋` : `${student.firstName} ${student.lastName}`}
        </h1>
        <RatingStars
          rating={aggregateRating}
          totalReviews={reviewsReceived.filter((r) => !r.isDeleted).length}
          size="lg"
        />
      </div>

      <div className="profile-tabs">
        <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
        {isOwnProfile && (
          <button className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Account Settings</button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <section className="panel profile-panel">
            <div className="profile-panel-header">
              <h2>Profile Information</h2>
              {isOwnProfile && (
                <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                  ✏️ {isEditing ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>

            {isEditing && formData ? (
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => handleEditChange('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => handleEditChange('lastName', e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>School</label>
                    <input type="text" value={formData.school} onChange={(e) => handleEditChange('school', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Field of Study (Major)</label>
                    <input type="text" value={formData.major} onChange={(e) => handleEditChange('major', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Expected Year of Graduation</label>
                  <input type="number" value={formData.graduationYear} onChange={(e) => handleEditChange('graduationYear', Number(e.target.value))} />
                </div>

                <div className="form-actions">
                  <button className="save-button" onClick={handleSaveProfile}>Save Changes</button>
                  <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="profile-row">
                  <div className="profile-field"><label>First Name</label><p>{student.firstName}</p></div>
                  <div className="profile-field"><label>Last Name</label><p>{student.lastName}</p></div>
                </div>
                <div className="profile-row">
                  <div className="profile-field"><label>School</label><p>{student.school}</p></div>
                  <div className="profile-field"><label>Field of Study (Major)</label><p>{student.major}</p></div>
                </div>
                {isOwnProfile && (
                  <div className="profile-row">
                    <div className="profile-field"><label>Expected Year of Graduation</label><p>{student.graduationYear}</p></div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {!isOwnProfile && loggedInUserId && (
              <div className="review-action-container">
                <button className="rate-button" onClick={() => setShowReviewModal(true)}>
                  ✏️ Rate {student.firstName}
                </button>
              </div>
            )}

            <section className="panel reviews-subsection">
              <h2>Reviews Received</h2>
              {reviewsReceived.filter((r) => !r.isDeleted).length > 0 ? (
                <div>
                  <div className="aggregate-score">
                    <p>Overall Peer Rating: <strong>{aggregateRating.toFixed(1)}/5</strong></p>
                  </div>
                  <div className="review-list">
                    {reviewsReceived.map((review) => (
                      <ReviewCard key={review.id} review={review} currentUserId={loggedInUserId} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="muted">No reviews received yet.</p>
              )}
            </section>

            {isOwnProfile && (
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
            )}

            {showReviewModal && (
              <ReviewForm
                student={student}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleSubmitReview}
              />
            )}
          </div>
        )}

        {isOwnProfile && activeTab === 'settings' && (
          <section className="panel settings-panel">
            <div className="settings-section">
              <h3>Security</h3>
              <button className="setting-button">Change Password</button>
              <button className="setting-button">Manage Multi-Factor Authentication</button>
            </div>

            <div className="settings-section">
              <h3>Notifications</h3>
              <label className="toggle-option"><input type="checkbox" defaultChecked /><span>Alert me when I receive a new review</span></label>
              <label className="toggle-option"><input type="checkbox" defaultChecked /><span>Alert me when someone likes my review</span></label>
            </div>

            <div className="settings-section">
              <h3>Privacy</h3>
              <label className="toggle-option"><input type="checkbox" /><span>Hide my expected graduation year from search results</span></label>
              <label className="toggle-option"><input type="checkbox" /><span>Hide my major from search results</span></label>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
