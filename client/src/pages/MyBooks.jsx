import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function MyBooks(){
  const [books, setBooks] = useState([])
  const { user } = useContext(AuthContext)
  useEffect(()=>{
    api.get('/api/books').then(r=>{
      if (user) setBooks(r.data.filter(b=>b.owner && b.owner._id === user.id))
      else setBooks([])
    }).catch(()=>{})
  },[user])
  return (
    <div>
      <h2 className="mb-3">My Books</h2>
      <div className="row g-3">
        {books.map(b => (
          <div className="col-md-4" key={b._id}>
            <div className="card h-100">
              {b.image && <img className="card-img-top" src={b.image} alt={b.title} />}
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text">{b.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
