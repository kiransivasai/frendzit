import { Avatar } from "@material-ui/core";
import React from "react";
import "./UserCard.css";

function UserCard({ user }) {
  return (
    <div className="userCard">
      <div className="userCard__body">
        <div className="userCard__top">
          <Avatar src={user.photoURL} className="userCard__dp" />
          <h2> {user.displayName} </h2>
        </div>
        <div className="userCard__center">
          <p>
            <span>30</span> Posts
          </p>
          <p>
            <span>76</span> Friends
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
