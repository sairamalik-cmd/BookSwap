import React, { useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/login', { email, password })
      if (res.data.token) setAuth({ token: res.data.token, user: res.data.user })
      navigate('/')
    } catch (err) {
      alert('Login failed')
    }
  }
  return (
    <div>
      <h2 className="mb-3">Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  )
}
