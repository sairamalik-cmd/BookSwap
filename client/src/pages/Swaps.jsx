import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function Swaps(){
  const { user } = useContext(AuthContext)
  const [swaps, setSwaps] = useState([])

  const loadSwaps = () => {
    api.get('/api/swaps/my').then(r=>setSwaps(r.data)).catch(()=>{})
  }

  useEffect(()=>{ loadSwaps() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/swaps/${id}`, { status })
      loadSwaps()
    } catch (err) {
      alert('Failed to update swap')
    }
  }

  const incoming = swaps.filter(s => s.owner && s.owner._id === user?.id)
  const outgoing = swaps.filter(s => s.requester && s.requester._id === user?.id)

  const badgeClass = status => {
    if (status === 'Accepted') return 'text-bg-success'
    if (status === 'Rejected') return 'text-bg-danger'
    if (status === 'Completed') return 'text-bg-primary'
    return 'text-bg-warning'
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Swap Requests</h2>
          <div className="small text-muted">Only book owners can accept or reject incoming requests.</div>
        </div>
        <button className="btn btn-outline-primary" onClick={loadSwaps}>Refresh</button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Incoming</h5>
              {incoming.length === 0 && <p className="text-muted">No incoming requests</p>}
              {incoming.map(s => (
                <div className="swap-row" key={s._id}>
                  <div>
                    <div className="fw-semibold">{s.requestedBook?.title}</div>
                    <div className="small text-muted">Requested by {s.requester?.name || 'User'}</div>
                    {s.offeredBook?.title && <div className="small">Offered: {s.offeredBook.title}</div>}
                    <div className="small">Status: {s.status}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" disabled={s.status !== 'Pending'} onClick={() => updateStatus(s._id, 'Accepted')}>Accept</button>
                    <button className="btn btn-sm btn-outline-danger" disabled={s.status !== 'Pending'} onClick={() => updateStatus(s._id, 'Rejected')}>Reject</button>
                    <button className="btn btn-sm btn-primary" disabled={s.status !== 'Accepted'} onClick={() => updateStatus(s._id, 'Completed')}>Complete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Outgoing</h5>
              {outgoing.length === 0 && <p className="text-muted">No outgoing requests</p>}
              {outgoing.map(s => (
                <div className="swap-row" key={s._id}>
                  <div>
                    <div className="fw-semibold">{s.requestedBook?.title}</div>
                    <div className="small text-muted">Status: {s.status}</div>
                    {s.offeredBook?.title && <div className="small">Offered: {s.offeredBook.title}</div>}
                  </div>
                  <span className={`badge ${badgeClass(s.status)}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
