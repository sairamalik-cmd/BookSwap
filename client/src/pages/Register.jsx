import React, { useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/register', { name, email, password })
      if (res.data.token) setAuth({ token: res.data.token, user: res.data.user })
      navigate('/')
    } catch (err) {
      alert('Register failed')
    }
  }
  return (
    <div>
      <h2 className="mb-3">Register</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}
