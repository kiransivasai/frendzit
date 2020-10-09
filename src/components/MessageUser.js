import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function MessageUser({ friendId }) {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  useEffect(() => {
    db.collection("users")
      .doc(friendId)
      .get()
      .then((doc) => {
        setName(doc.data().name);
        setPic(doc.data().photoUrl);
      });
  });
  return (
    <div className="messages__user">
      <Avatar src={pic} className="messages__userPic" />
      <h3> {name} </h3>
    </div>
  );
}

export default MessageUser;
