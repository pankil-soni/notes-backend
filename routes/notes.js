const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator')

//Route 1 get all the notes using : GET "api/notes/fetchallnotes".require login.

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        //finding all notes of given user.
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 2 add new note : POST "api/notes/addnote".require login.

router.post('/addnote', [

    body('title', "Title should be alteast 3 characters long").isLength({ min: 3 }),
    body('description', "description must be of 5 characters").isLength({ min: 5 }),

], fetchuser, async (req, res) => {


    try {
        //if there are errors return Bad request and errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //creating a new note from request body
        const { title, description, tag } = req.body;

        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savednote = await note.save();
        res.send(savednote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})



//Route 3 get a note having id using : GET "api/notes/getnote:id".require login.

router.get('/getnote:id', fetchuser, async (req, res) => {

    try {
        //finding all notes of given user.
        const notes = await Notes.find({ user: req.user.id });
        let note = notes.find((note) => note.id === req.params.id);
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 4 update a note having id using : POST "api/notes/updatenote:id".require login.

router.post('/updatenote:id', fetchuser, async (req, res) => {

    try {
        //finding all notes of given user.

        const notes = await Notes.find({ user: req.user.id });
        let note = notes.find((note) => note.id === req.params.id);

        if (note) {
            let { title, description, tag } = req.body;
            await Notes.findByIdAndUpdate(req.params.id, {
                title, description, tag
            })
            res.json("Updated successfully");
        }
        else {
            return res.status(401).send("Unauthorized/Note does not exist");
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 5 delete a note having id using : POST "api/notes/deletenote:id".require login.

router.post('/deletenote:id', fetchuser, async (req, res) => {

    try {
        //finding note and deleting if note exists.

        const notes = await Notes.find({ user: req.user.id });
        let note = notes.find((note) => note.id === req.params.id);

        if (note) {
            console.log("Same user");
            await Notes.findByIdAndDelete(req.params.id)
            res.json("Deleted successfully");
        }
        else {
            return res.status(401).send("Unauthorized/Note does not exist");
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})
module.exports = router