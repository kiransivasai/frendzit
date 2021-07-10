import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import "./GroupMember.css";
import firebase from "firebase";

function GroupMember({ id, isAdmin, isGroupAdmin, user, groupId }) {
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
    db.collection("groups")
      .doc(groupId)
      .update({
        admins: firebase.firestore.FieldValue.arrayUnion(id),
      });
    setCheckAdmin(true);
  };
  const removeAdmin = (e) => {
    db.collection("groups")
      .doc(groupId)
      .update({
        admins: firebase.firestore.FieldValue.arrayRemove(id),
      });
    setCheckAdmin(false);
  };

  return (
    <>
      {isGroupAdmin ? (
        <div className="groupMember">
          <div className="groupMember__top">
            <Avatar className="liked__person" src={pic} />
            <Link to={"/users/" + id} className="groupMembers__link">
              <div className="groupMember__details">
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
            <div className="groupMember__end">
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
        <Link to={"/users/" + id} className="groupMembers__link">
          <div className="groupMember">
            <Avatar className="liked__person" src={pic} />
            <div className="groupMember__details">
              <h3>{name}</h3>
              {isAdmin ? (
                <p className="admin">
                  <div></div>Admin
                </p>
              ) : (
                <p className="member">
                  <div></div>Member
                </p>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default GroupMember;
