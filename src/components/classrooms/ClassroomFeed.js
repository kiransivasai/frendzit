import React, { useEffect, useState } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import CreateClassroom from "./CreateClassroom";
import "./ClassroomFeed.css";
import ClassCard from "./ClassCard";
import { Button, Dialog } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import firebase from "firebase";

function ClassroomFeed({ location, user }) {
  const [open, setOpen] = useState(false);
  const [clsCode, setClsCode] = useState("");
  const [errText, setErrText] = useState("");
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("class_rooms")
        .where("students", "array-contains", user.uid)
        .onSnapshot((snapshot) => {
          setClassrooms(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  }, [user]);
  const handleClose = (e) => {
    setOpen(false);
  };
  const joinClassroom = (e) => {
    e.preventDefault();
    db.collection("class_rooms")
      .where("classId", "==", clsCode.trim())
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          db.collection("class_rooms")
            .doc(doc.id)
            .update({
              students: firebase.firestore.FieldValue.arrayUnion(user.uid),
            });
        });
        setOpen(false);
      })
      .catch((error) => {
        setErrText(error.message);
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <div className="classroom__modal">
          <div className="classroom__modalTop">
            <h1>Join Classroom</h1>
            <CloseIcon className="modalClose" onClick={(e) => setOpen(false)} />
          </div>
          <form
            className="classroom__modalCenter"
            onSubmit={(e) => joinClassroom(e)}
          >
            <input
              className="classroom__modalInput"
              value={clsCode}
              onChange={(e) => setClsCode(e.target.value)}
              placeholder="Class Code"
            />
            <Button
              type="submit"
              disabled={!clsCode}
              className="classroom__modalButton"
            >
              Join
            </Button>
          </form>
          <h1>{errText}</h1>
        </div>
      </Dialog>
      <div className="classroomFeed">
        <div className="classroomFeed__top">
          <div className="classroomFeed__info">
            <h3>Classrooms</h3>
            <Button
              onClick={(e) => setOpen(true)}
              className="classroomJoin"
              to={`${location}/join`}
            >
              Join
            </Button>

            <Link className="classroomCreate" to={`${location}/create`}>
              Create
            </Link>
          </div>
        </div>

        <div className="cls__posts">
          {classrooms.map((classroom) => (
            <ClassCard
              classId={classroom.data.classId}
              user={user}
              name={classroom.data.name}
              key={classroom.id}
              docId={classroom.id}
              color={classroom.data.color}
              createdBy={classroom.data.createdBy}
              createdOn={classroom.data.createdOn}
              description={classroom.data.description}
              students={classroom.data.students}
            />
          ))}
        </div>

        <Route
          path={`${location}/create`}
          render={() => {
            return <CreateClassroom user={user} />;
          }}
        />
      </div>
    </>
  );
}

export default ClassroomFeed;
