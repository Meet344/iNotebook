const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");
var fetchUser = require("../middleware/fetchUser");

// ROUTE 1: Get all the Notes using GET request to "/api/notes/fetchnotes" Auth Required
router.get("/fetchnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.messsage);
    return res.status(500).send("Some error Occured");
  }
});

// ROUTE 2: Add a note using POST request to "/api/notes/addnotes"
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Title must be of 3 letters").isLength({ min: 3 }),
    body("description", "Description must be min 5 letters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //check whether there are any errors and return bad request if exist
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.messsage);
      return res.status(500).send("Some error Occured");
    }
  }
);

// ROUTE 3: Update an existing note using POST request to "/api/notes/updatenote"   Auth required
router.put("/updatenote/:id" , fetchUser , async (req,res)=>{

    try {
        
        const { title, description, tag } = req.body;
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
    
        //Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        //Check whether the note belongs to current user
        if(note.user.toString() !== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
    
        //Update the Note
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json(note)
    
    } catch (error) {
        console.log(error.messsage);
        return res.status(500).send("Some error Occured");
      }


}); 

//ROUTE 4: Delete a Note using delete request to "/api/notes/deletenote"
router.delete("/deletenote/:id" , fetchUser , async (req,res)=>{

    try {
        //Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        //Check whether the note belongs to current user
        if(note.user.toString() !== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
    
        //Update the Note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note is being successfully deleted"});
        
    } catch (error) {
        console.log(error.messsage);
        return res.status(500).send("Some error Occured");
      }

});

module.exports = router;
