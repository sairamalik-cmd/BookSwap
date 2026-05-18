import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Home() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(true)

  const loadBooks = () => {
    const params = {}
    if (query) params.q = query
    if (genre) params.genre = genre
    if (onlyAvailable) params.available = 'true'
    api.get('/api/books', { params }).then(r => setBooks(r.data)).catch(() => {})
  }
  useEffect(() => {
    loadBooks()
  }, [])
  return (
    <div>
      <div className="hero mb-4">
        <div>
          <div className="eyebrow">Community Exchange</div>
          <h1>BookSwap</h1>
          <p>Swap books you love, discover new reads, and connect with local readers.</p>
          <div className="d-flex gap-2">
            <Link className="btn btn-primary" to="/add">Add a Book</Link>
            <Link className="btn btn-outline-light" to="/swaps">View Swaps</Link>
          </div>
        </div>
      </div>

      <div className="filter-bar mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Search</label>
            <input className="form-control" placeholder="Title or author" value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Genre</label>
            <input className="form-control" placeholder="e.g. Fiction" value={genre} onChange={e=>setGenre(e.target.value)} />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input className="form-check-input" type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} id="availableCheck" />
              <label className="form-check-label" htmlFor="availableCheck">Only available</label>
            </div>
          </div>
        </div>
        <div className="mt-2 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadBooks}>Apply</button>
          <button className="btn btn-outline-secondary" onClick={() => { setQuery(''); setGenre(''); setOnlyAvailable(true); setTimeout(loadBooks, 0) }}>Reset</button>
        </div>
      </div>

      <div className="row g-3">
        {books.map(b => (
          <div className="col-md-4" key={b._id}>
            <div className="card h-100 card-hover">
              {b.image && <img className="card-img-top" src={b.image} alt={b.title} />}
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text">{b.author}</p>
                {!b.availability && <span className="badge text-bg-secondary me-2">Not available</span>}
                <Link to={`/book/${b._id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
