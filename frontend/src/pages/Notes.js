import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Notes.css'

function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const navigate = useNavigate()

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/api/notes', { headers: { Authorization: localStorage.getItem('token') } })
    setNotes(res.data)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingNote) {
      await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, { title, content }, { headers: { Authorization: localStorage.getItem('token') } })
      setEditingNote(null)
    } else {
      await axios.post('http://localhost:5000/api/notes', { title, content }, { headers: { Authorization: localStorage.getItem('token') } })
    }
    setTitle('')
    setContent('')
    fetchNotes()
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers: { Authorization: localStorage.getItem('token') } })
    fetchNotes()
  }

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="note-input"
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="note-textarea"
        ></textarea>
        <button type="submit" className="submit-button">
          {editingNote ? 'Update' : 'Create'} Note
        </button>
      </form>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note._id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="button-group">
              <button className="edit-btn" onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={() => {localStorage.removeItem('token'); navigate('/')}}>
        Logout
      </button>
    </div>
  )
}

export default Notes