import React from 'react'
import Layout from './Layout'
import { Route, Routes } from 'react-router-dom'
import AuthContainer from './pages/auth/AuthContainer'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/*" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>} />
        <Route path="/auth" element={<PublicRoute>
          <AuthContainer />
        </PublicRoute>} />
      </Routes>
    </Layout>
  )
}

export default App