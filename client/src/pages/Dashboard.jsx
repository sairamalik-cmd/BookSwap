import React, { useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({ books: 0, swaps: 0, pending: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/api/books'),
      api.get('/api/swaps/my')
    ]).then(([booksRes, swapsRes]) => {
      const myBooks = booksRes.data.filter(b => b.owner && b.owner._id === user?.id)
      const mySwaps = swapsRes.data
      const pending = mySwaps.filter(s => s.status === 'Pending').length
      setStats({ books: myBooks.length, swaps: mySwaps.length, pending })
    }).catch(()=>{})
  }, [user])

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">My Books</div>
            <div className="stat-value">{stats.books}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Total Swaps</div>
            <div className="stat-value">{stats.swaps}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
