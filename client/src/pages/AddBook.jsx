import React, { useState } from 'react'
import api from '../services/api'

export default function AddBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [condition, setCondition] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  const submit = async e => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('author', author)
      fd.append('genre', genre)
      fd.append('condition', condition)
      fd.append('description', description)
      if (image) fd.append('image', image)

      await api.post('/api/books', fd)
      alert('Book added')
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Failed to add book'
      alert(msg)
    }
  }

  return (
    <div>
      <h2 className="mb-3">Add Book</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input className="form-control" placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input className="form-control" placeholder="Genre" value={genre} onChange={e=>setGenre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Condition</label>
          <input className="form-control" placeholder="Condition" value={condition} onChange={e=>setCondition(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input className="form-control" type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
        </div>
        <button className="btn btn-primary">Add</button>
      </form>
    </div>
  )
}
