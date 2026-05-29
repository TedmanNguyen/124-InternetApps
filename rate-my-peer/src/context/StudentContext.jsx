import { createContext, useContext, useMemo, useState } from 'react'
import { mockStudents } from '../data/mockStudents'
import { addReview as pushReview } from '../data/mockReviews'
import axios from 'axios'
import { urls } from '../data/urls';
import { admins } from '../data/admins'

const StudentContext = createContext(null)

// TODO: Link to backend

export function StudentProvider({ children }) {
  const [students, setStudents] = useState({})
  const [loggedInUserId, setLoggedInUserId] = useState("6a16652ff96a78e517049c23")
  const [loggedInUser, setLoggedInUser] = useState(null)

  const addStudent = ({ firstName, lastName, email, major }) => {
    const newStudent = {
      id: `stu-${Date.now()}`,
      firstName,
      lastName,
      email,
      major,
      school: 'UC Irvine', // Default school
      graduationYear: new Date().getFullYear() + 2, // Default 2 years from now
      profilePic: null,
      reviews: [],
    }

    try {
      const response = axios.post(`${urls.base}/${urls.studentsEndpoint}`, newStudent)
      setStudents((previousStudents) => ({
        ...previousStudents,
        [response.data._id]: response.data,
      }))
      return newStudent
    } catch (error) {
        console.error('Error adding student:', error)
    }
  }

  const fetchAllStudents = async () => {
    try {
        const response = await axios.get(`${urls.base}/${urls.studentsEndpoint}`)
        const studentsArray = response.data
        const studentsMap = {}
        studentsArray.forEach((student) => {
            studentsMap[student._id] = student
        })
        setStudents(studentsMap)
        return studentsMap
    } catch (error) {
        console.error('Error fetching students:', error)
    }
  }

  // getStudentById: (studentId) =>
  //       students[studentId],
  //     getStudentByEmail: (email) =>
  //       students.find((student) => student.email.toLowerCase() === email.toLowerCase()),
  //     getLoggedInUser: () =>
  //       students[loggedInUserId],

  const fetchStudentById = (studentId) => {
    if (students[studentId]) {
      return students[studentId]
    } else {
      try {
        const response = axios.get(`${urls.base}/${urls.studentsEndpoint}/${studentId}`)
        const student = response.data
        setStudents((previousStudents) => ({
          ...previousStudents,
          [student._id]: student,
        }))
        return student
      } catch (error) {
          console.error('Error fetching student by ID:', error)
      }
    }
  }

  const fetchStudentByEmail = (email) => {
    const student = Object.values(students).find((student => student.email.toLowerCase() === email.toLowerCase()))
    if (student) {
      return student
    } else {
      try {
        // TODO: Implement the endpoint for this
        const response = axios.get(`${urls.base}/${urls.studentsEndpoint}?email=${email}`)
        const fetchedStudent = response.data
        setStudents((previousStudents) => ({
          ...previousStudents,
          [fetchedStudent._id]: fetchedStudent,
        }))
        return fetchedStudent
      } catch (error) {
          console.error('Error fetching student by email:', error)
      }
  }}

  const getLoggedInUser = () => {
    if (!loggedInUserId) {
      return null
    }
    if (students[loggedInUserId]) {
      return students[loggedInUserId]
    } else {
      try {
        const response = axios.get(`${urls.base}/${urls.studentsEndpoint}/${loggedInUserId}`)
        const student = response.data
        setStudents((previousStudents) => ({
          ...previousStudents,
          [student._id]: student,
        }))
        return student
      } catch (error) {
          console.error('Error fetching logged in user:', error)
      }
    }
  }

  const value = useMemo(
    () => ({
      students,
      fetchAllStudents,
      addStudent,
      loggedInUserId,
      setLoggedInUserId,
      loggedInUser,
      setLoggedInUser,
      fetchStudentById,
      fetchStudentByEmail,
      getLoggedInUser,
      userIsAdmin: () => admins.includes(loggedInUserId), // John Doe is the admin
    }),
    [students, loggedInUserId],
  )

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentContext)

  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider')
  }

  return context
}

