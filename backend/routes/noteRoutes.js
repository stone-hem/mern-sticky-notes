const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')

//routes
router.route('/')
    .get(notesController.getNotes)
    .post(notesController.createNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router