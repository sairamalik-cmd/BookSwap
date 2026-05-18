import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddBook from './pages/AddBook'
import BookDetails from './pages/BookDetails'
import MyBooks from './pages/MyBooks'
import Dashboard from './pages/Dashboard'
import Swaps from './pages/Swaps'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, AuthContext } from './context/AuthContext'

function AppInner(){
  const { user, logout } = useContext(AuthContext)
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link to="/" className="navbar-brand">BookSwap</Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            {user ? (
              <>
                <Link to="/my" className="nav-link">My Books</Link>
                <Link to="/add" className="nav-link">Add Book</Link>
                <Link to="/swaps" className="nav-link">Swaps</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button className="btn btn-outline-secondary ms-2" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/add" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/my" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/swaps" element={<ProtectedRoute><Swaps /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
