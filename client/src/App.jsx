import React from 'react'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import AuthContainer from './pages/auth/AuthContainer'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { Navigate } from 'react-router-dom'

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthContainer />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Catch all wrong routes and redirect to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App