import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Comment.css";

function Comment({ userData, comment, postedOn }) {
  const [image, setImage] = useState("");
  const [displayName, setDisplayName] = useState("");
  userData
    ? userData.get().then((doc) => {
        setImage(doc.data().photoUrl);
        setDisplayName(doc.data().name);
      })
    : console.log("Anonymous");
  return (
    <div className="comment">
      <div className="commentView__top">
        <Avatar src={image} className="commentView__avatar" />
        <div className="commentView__topInfo">
          <p>
            <span className="commentView__topHeader">{displayName}: </span>
            {comment}
          </p>
          <p style={{ color: "gray" }}>{postedOn}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
