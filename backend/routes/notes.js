const express = require('express')
const Note = require('../models/Note')
const jwt = require('jsonwebtoken')

const router = express.Router()

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

router.use(authMiddleware)

router.get('/', async (req, res) => {
    const notes = await Note.find({ userId: req.userId })
    res.json(notes)
})

router.post('/', async (req, res) => {
    const { title, content } = req.body
    const note = new Note({ userId: req.userId, title, content })
    await note.save()
    res.status(201).json(note)
})

router.put('/:id', async (req, res) => {
    const { title, content } = req.body
    const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { title, content }, { new: true })
    res.json(note)
})

router.delete('/:id', async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    res.json({ message: 'Note deleted' })
})

module.exports = router
