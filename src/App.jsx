import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default App
