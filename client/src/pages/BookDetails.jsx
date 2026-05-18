import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function BookDetails(){
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [myBooks, setMyBooks] = useState([])
  const [offeredBook, setOfferedBook] = useState('')
  const [incomingForBook, setIncomingForBook] = useState([])
  const { user, isAuthenticated } = useContext(AuthContext)
  useEffect(()=>{
    api.get(`/api/books/${id}`).then(r=>setBook(r.data)).catch(()=>{})
  },[id])
  useEffect(()=>{
    if (!isAuthenticated) return
    api.get('/api/books').then(r => {
      const owned = r.data.filter(b => b.owner && b.owner._id === user?.id)
      setMyBooks(owned)
    }).catch(()=>{})
  },[isAuthenticated, user])

  useEffect(()=>{
    if (!isAuthenticated || !book) return
    if (user?.id !== book.owner?._id) return
    api.get('/api/swaps/my').then(r => {
      const incoming = r.data.filter(s => s.requestedBook?._id === book._id)
      setIncomingForBook(incoming)
    }).catch(()=>{})
  },[isAuthenticated, user, book])

  const updateStatus = async (swapId, status) => {
    try {
      await api.put(`/api/swaps/${swapId}`, { status })
      const refreshed = await api.get('/api/swaps/my')
      const incoming = refreshed.data.filter(s => s.requestedBook?._id === book._id)
      setIncomingForBook(incoming)
    } catch (err) {
      alert('Failed to update swap')
    }
  }

  const requestSwap = async () => {
    try {
      if (!offeredBook) return alert('Please select one of your books to offer')
      await api.post('/api/swaps', {
        owner: book.owner?._id,
        requestedBook: book._id,
        offeredBook
      })
      alert('Swap request sent')
    } catch (err) {
      alert('Failed to send swap request')
    }
  }
  if (!book) return <div>Loading...</div>
  return (
    <div>
      <div className="card">
        {book.image && <img src={book.image} className="card-img-top" alt={book.title} />}
        <div className="card-body">
          <h2 className="card-title">{book.title}</h2>
          <p className="card-text">Author: {book.author}</p>
          <p className="card-text">Genre: {book.genre}</p>
          <p className="card-text">Condition: {book.condition}</p>
          <p className="card-text">{book.description}</p>
          {!book.availability && <span className="badge text-bg-secondary">Not available</span>}
          {isAuthenticated && user?.id !== book.owner?._id && (
            <div className="swap-cta mt-3">
              <div className="fw-semibold mb-2">Request a Swap</div>
              <div className="row g-2 align-items-end">
                <div className="col-md-8">
                  <label className="form-label">Offer one of your books</label>
                  <select className="form-select" value={offeredBook} onChange={e=>setOfferedBook(e.target.value)}>
                    <option value="">Select a book</option>
                    {myBooks.map(b => (
                      <option key={b._id} value={b._id}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-primary w-100" disabled={!book.availability} onClick={requestSwap}>Send Request</button>
                </div>
              </div>
            </div>
          )}
          {isAuthenticated && user?.id === book.owner?._id && (
            <div className="swap-cta mt-3">
              <div className="fw-semibold mb-2">Incoming Requests for This Book</div>
              {incomingForBook.length === 0 && <div className="text-muted">No requests yet.</div>}
              {incomingForBook.map(s => (
                <div className="swap-row" key={s._id}>
                  <div>
                    <div className="fw-semibold">Requested by {s.requester?.name || 'User'}</div>
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
          )}
        </div>
      </div>
    </div>
  )
}
