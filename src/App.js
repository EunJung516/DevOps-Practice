import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { AdminPage, ChatPage, LoginPage, MainPage } from './pages'
import './App.css'

const isLoggedIn = () => !!localStorage.getItem('NaviToken')
const getUserType = () => localStorage.getItem('NaviUserType') || ''

const ProtectedRoute = ({ children, allowedTypes, path }) => {
  const userType = getUserType()

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  if (userType === 'admin' && path !== '/admin') {
    return <Navigate to="/admin" replace />
  }
  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/" replace />
  }

  return children
}

const AuthRoute = ({ children }) => {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const [userType, setUserType] = useState(getUserType())

  console.log('APP_SERVER_URL: ', process.env.REACT_APP_SERVER_URL)
  console.log('TEST_VAR:', process.env.REACT_APP_TEST_VAR)

  useEffect(() => {
    const storedUserType = getUserType()
    setUserType(storedUserType)
  }, [])

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage setUserType={setUserType} />
            </AuthRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedTypes={['admin']} path="/admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedTypes={['user', 'admin']} path="/chat">
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute allowedTypes={['user', 'admin']} path="/">
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
