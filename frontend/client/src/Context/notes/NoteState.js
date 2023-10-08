import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = [
  ];

  const [notes, setNotes] = useState(notesInitial);

  //Get all Note
  const getNotes = async() => {
    //TODO API CALL

    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
    });

    //Logic to fetch Notes
    const json = await response.json();
    setNotes(json);
  };


  //Add a Note
  const addNote = async(title, description, tag) => {
    console.log("Adding a new Note");
    //TODO API CALL

    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}),
    });
    const json = await response.json();

    //Logic to add Note
    const note = json;
    setNotes(notes.concat(note));
  };

  //Delete a Note
  const deleteNote = async(id) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);


    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });

    console.log(`deleting the note with id ${id}`);
    setNotes(newNotes);
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API CALL

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({title, description, tag}),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes))

    //Logic for editing the note
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];

      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
