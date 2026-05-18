import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(()=>{
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [token, user])

  const setAuth = ({ token: t, user: u }) => {
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    api.defaults.headers.Authorization = undefined
  }

  const value = { user, token, setAuth, logout, isAuthenticated: !!token }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
