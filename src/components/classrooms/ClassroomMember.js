import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import "./ClassroomMember.css";
import firebase from "firebase";

function ClassroomMember({ id, isAdmin, isClassroomAdmin, user, classroomId }) {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [checkAdmin, setCheckAdmin] = useState(false);
  useEffect(() => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.data()) {
          setName(doc.data().name);
          setPic(doc.data().photoUrl);
        }
      });
    setCheckAdmin(isAdmin);
  }, [id, isAdmin]);
  const makeAdmin = (e) => {
    db.collection("classroom")
      .doc(classroomId)
      .update({
        admins: firebase.firestore.FieldValue.arrayUnion(id),
      });
    setCheckAdmin(true);
  };
  const removeAdmin = (e) => {
    db.collection("classroom")
      .doc(classroomId)
      .update({
        admins: firebase.firestore.FieldValue.arrayRemove(id),
      });
    setCheckAdmin(false);
  };

  return (
    <>
      {isClassroomAdmin ? (
        <div className="classroomMember">
          <div className="classroomMember__top">
            <Avatar className="liked__person" src={pic} />
            <Link to={"/users/" + id} className="classroomMembers__link">
              <div className="classroomMember__details">
                <h3>{name}</h3>
                {checkAdmin ? (
                  <div className="admin">
                    <div></div>Admin
                  </div>
                ) : (
                  <div className="member">
                    <div></div>Member
                  </div>
                )}
              </div>
            </Link>
          </div>
          {user.uid !== id && (
            <div className="classroomMember__end">
              {checkAdmin ? (
                <Button
                  className="remove__admin"
                  onClick={(e) => removeAdmin(e)}
                >
                  Remove Admin
                </Button>
              ) : (
                <Button className="make__admin" onClick={(e) => makeAdmin(e)}>
                  Make Admin
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Link to={"/users/" + id} className="classroomMembers__link">
          <div className="classroomMember">
            <Avatar className="liked__person" src={pic} />
            <div className="classroomMember__details">
              <h3>{name}</h3>
              {isAdmin ? (
                <div className="admin">
                  <div></div>Admin
                </div>
              ) : (
                <div className="member">
                  <div></div>Member
                </div>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default ClassroomMember;
