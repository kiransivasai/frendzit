import React from "react";
import { Link } from "react-router-dom";
import Like from "./Like";
import "./Likes.css";

function Likes({ id, likes }) {
  return (
    <div className="likes">
      {likes &&
        Object.keys(likes).map((friend) => {
          if (likes[friend] === true) {
            return (
              <Link to={"/users/" + friend} className="friendLink" key={friend}>
                <Like key={friend} id={friend} />
              </Link>
            );
          }
          return "";
        })}
    </div>
  );
}

export default Likes;
