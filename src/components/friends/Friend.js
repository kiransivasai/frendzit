import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./Friend.css";

function Friend({ id }) {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
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
  }, [id]);
  return (
    <div className="friend">
      <Avatar className="friendProfile" src={pic} />
      <h3>{name}</h3>
    </div>
  );
}

export default Friend;
