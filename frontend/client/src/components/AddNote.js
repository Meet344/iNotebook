import React, { useContext, useState } from "react";
import NoteContext from "../Context/notes/NoteContext";

const AddNote = (props) => {

    let context = useContext(NoteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""});

    const handleClick = (e)=>{
      e.preventDefault();
      addNote(note.title, note.description, note.tag);
      setNote({title: "", description: "", tag: ""});
      props.showAlert("Note added successfully", "success")
    }
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

  return (
  <div className="container my-3">
  <h1>Add Notes</h1>
  <form className="my-3">
    <div className="form-group mb-3">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        className="form-control"
        id="title"
        name="title"
        value = {note.title}
        aria-describedby="emailHelp"
        placeholder="Enter Title"
        onChange={onChange}
        minLength = {5}
        required
      />
    </div>
    <div className="form-group mb-3">
      <label htmlFor="description">Description</label>
      <input
        type="text"
        className="form-control"
        id="description"
        name="description"
        value = {note.description}
        placeholder="Description"
        onChange={onChange}
        minLength = {5}
        required
      />
    </div>
    <div className="form-group mb-3">
      <label htmlFor="tag">Tag</label>
      <input
        type="text"
        className="form-control"
        id="tag"
        name="tag"
        value = {note.tag}
        placeholder="Tag"
        onChange={onChange}
      />
    </div>
    <button disabled= {note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
      Submit
    </button>
  </form>
</div>
  )
}

export default AddNote