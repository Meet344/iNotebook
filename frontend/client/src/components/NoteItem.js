import React, { useContext } from "react";
import NoteContext from "../Context/notes/NoteContext";

const NoteItem = (props) => {
  const { note , updateNote} = props;

  let context = useContext(NoteContext);
  const {deleteNote} = context;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <i className="fa-regular fa-trash-can mx-2" onClick={()=>{deleteNote(note._id); props.showAlert("Note Deleted successfully", "success")}}></i>
          <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note); props.showAlert("Note Updated successfully", "success")}}></i>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
