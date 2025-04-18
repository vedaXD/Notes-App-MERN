import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
    <div>
      <h2>Notes</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <button type="submit">{editingNote ? 'Update' : 'Create'} Note</button>
      </form>
      <div>
        {notes.map((note) => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={() => {localStorage.removeItem('token'); navigate('/')}}>Logout</button>
    </div>
  )
}

export default Notes
