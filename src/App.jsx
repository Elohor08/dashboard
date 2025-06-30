import React from 'react'
import Dashboard from './pages/dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FeedbackForm from './pages/feedback'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
    </BrowserRouter>
  )
}

export default App