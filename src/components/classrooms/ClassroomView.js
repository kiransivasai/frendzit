import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import ClassroomPostsFeed from "./ClassroomPostsFeed";
import ClassroomPostUploader from "./ClassroomPostUploader";
import ClassroomTopCard from "./ClassroomTopCard";
import "./ClassroomView.css";

function ClassroomView({ user, id }) {
  const [classroomMembers, setClassroomMembers] = useState([]);
  const [isStudent, setIsStudent] = useState(false);
  const history = useHistory("");
  useEffect(() => {
    db.collection("class_rooms")
      .doc(id)
      .onSnapshot((doc) => {
        setClassroomMembers(doc.data().students);
        if (!doc.data().students?.includes(user.uid)) {
          history.push("/classroom");
        } else {
          setIsStudent(true);
        }
      });
  }, [id, history, user]);
  return (
    <>
      {isStudent && (
        <div className="classroomView">
          <ClassroomTopCard user={user} id={id} />
          {classroomMembers.includes(user.uid) && (
            <ClassroomPostUploader user={user} id={id} />
          )}
          <ClassroomPostsFeed user={user} id={id} />
        </div>
      )}
    </>
  );
}

export default ClassroomView;
