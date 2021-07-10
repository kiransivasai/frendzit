import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./CreateClassroom.css";
import CloseIcon from "@material-ui/icons/Close";
import { db } from "../../firebase";
import firebase from "firebase";
import { nanoid } from "nanoid";

function CreateClassroom({ user }) {
  const history = useHistory("");

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };
  const enableScroll = () => {
    document.body.style.overflow = "";
  };
  disableScroll();
  const [clsName, setClsName] = useState("");
  const [clsDescription, setClsDescription] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const createClassroom = (e) => {
    e.preventDefault();
    let index = Math.floor(Math.random() * 7);
    let classCode = nanoid(8);
    let color = index;

    if (clsName && clsDescription) {
      db.collection("class_rooms")
        .add({
          classId: classCode,
          createdBy: user.uid,
          createdOn: firebase.firestore.FieldValue.serverTimestamp(),
          description: clsDescription,
          students: [user.uid],
          color: color,
          ref: db.collection("users").doc(user.uid),
          name: clsName,
        })
        .then(() => {
          setErrMsg("Classroom Created Successfully");
          setClsDescription("");
          setClsName("");
          enableScroll();
          history.push("/classroom");
        })
        .catch((error) => {
          setErrMsg("Error creating Classroom");
        });
    }
  };

  return (
    <div className="createClassroom">
      <div className="createClassroom__body">
        <div className="createClassroom__top">
          <h3>Create Classroom</h3>
          <Link
            to="/classroom"
            className="classroomLink"
            onClick={enableScroll}
          >
            <CloseIcon className="classroomCloseIcon" />
          </Link>
        </div>
        <div className="createClassroom__center">
          <form onSubmit={createClassroom}>
            <TextField
              className="createClassroom__input"
              label="Classroom Name"
              variant="outlined"
              required={true}
              value={clsName}
              onChange={(e) => setClsName(e.target.value)}
            />
            <TextField
              className="createClassroom__input"
              label="Classroom Description"
              variant="outlined"
              multiline={true}
              rows={4}
              required={true}
              value={clsDescription}
              onChange={(e) => setClsDescription(e.target.value)}
            />

            <span id="cls__text">{errMsg}</span>
            <Button
              type="submit"
              variant="contained"
              className="clsCreateButton"
            >
              Create Classroom
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateClassroom;
