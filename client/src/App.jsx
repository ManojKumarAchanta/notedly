
import React from 'react'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import AuthContainer from './pages/auth/AuthContainer'
import Dashboard from './pages/Dashboard'
import NotesPage from './pages/NotesPage'
import CreateNotePage from './pages/CreateNotePage'
import EditNotePage from './pages/EditNotePage'
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
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/create"
          element={
            <ProtectedRoute>
              <CreateNotePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            <ProtectedRoute>
              <EditNotePage />
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