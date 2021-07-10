import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./MessageUser.css";

function MessageUser({ friendId }) {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [status, setStatus] = useState(0);
  useEffect(() => {
    friendId &&
      friendId.onSnapshot((doc) => {
        setName(doc.data().name);
        setPic(doc.data().photoUrl);
        setStatus(doc.data().status);
      });
  });
  return (
    <div className="messages__user">
      <Avatar src={pic} className="messages__userPic" />
      <div className="message__name">
        <h3>{name}</h3>
        {status ? (
          <div className="user__status">
            <div className="online"></div>
            <p> online</p>
          </div>
        ) : (
          <div className="user__status">
            <div className="offline"></div>
            <p> offline</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageUser;
