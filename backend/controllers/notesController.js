const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')


//@desc Get users
//@route GET /users
//@access  Private

const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes available!' })
    }
    // Add username to each note before sending the response 
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser);

})

// @desc Create new note
// @route POST /notes
// @access Private
const createNote = asyncHandler(async (req, res) => {
    const { user, title, desc } = req.body

    // Confirm data
    if (!user || !title || !desc) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Create and store the new user 
    const note = await Note.create({ user, title, desc })

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})



//@desc Update user
//@route PATCH /users
//@access Private

const updateNote = asyncHandler(async (req, res) => {
    const { id,user, title, desc, completed } = req.body
    // if (!user || !desc || !title || typeof completed !== 'boolean') {
    //     return res.status(400).json({ message: 'Kindly fill all field' })
    // }
    if (!id ) {
        return res.status(400).json({ message: 'Id required' })
    } else if(!user) {
        return res.status(400).json({ message: 'User required' })
    }else if(!desc) {
        return res.status(400).json({ message: 'Desc required' })
    }else if(!title) {
        return res.status(400).json({ message: 'Title required' })
    }else if(typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Must be boolean' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: "Note not available" })
    }


      // Check for duplicate title
      const duplicate = await Note.findOne({ title }).lean().exec()

      // Allow renaming of the original note 
      if (duplicate && duplicate?._id.toString() !== id) {
          return res.status(409).json({ message: 'Duplicate note title' })
      }
  
      note.user = user
      note.title = title
      note.desc = desc
      note.completed = completed
  
      const updatedNote = await note.save()
  
      res.json(`'${updatedNote.title}' updated`)
})

//@desc Delete note
//@route DELETE /notes
//@access Private

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "Kindly provide note ID" })
    }

    const note = await Note.findByIdAndDelete(id).lean().exec()

    const reply = `Note ${note.title} Id: ${note._id} deleted`

    res.json(reply)
})

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
}