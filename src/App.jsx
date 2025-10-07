import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import FeedArticles from './pages/FeedArticles.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feed/:feedId" element={<FeedArticles />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
