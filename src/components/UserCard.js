import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Advertisement from "./Advertisement";
import "./UserCard.css";

function UserCard({ user }) {
  const [friends, setFriends] = useState(0);
  const [postCount, setPostCount] = useState(0);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.data()) {
            setFriends(doc.data().friends);
            setPostCount(doc.data().postCount);
          }
        });
    }
  }, [user]);
  return (
    <div className="userCard">
      <div className="userCard__body">
        <div className="userCard__top">
          <Avatar src={user.photoURL} className="userCard__dp" />
          <h2> {user.displayName} </h2>
        </div>
        <div className="userCard__center">
          <p>
            <span> {postCount ? postCount : 0} </span> &nbsp;Posts
          </p>
          <p>
            <span>
              {friends
                ? Object.values(friends)?.reduce(
                    (pre, cur) => (cur === 3 ? ++pre : pre),
                    0
                  )
                : 0}
            </span>{" "}
            Friends
          </p>
        </div>
      </div>
      <div className="advertisement__blocks">
        <Advertisement
          title="pranitha herbals"
          image={
            "https://d1q7rcky2z4kkl.cloudfront.net/public/sescommunityads_attachment/1e/0e/fdc9e3706f3036f8d81c5ebddce9c995.jpeg"
          }
          desc={"Testing the one line"}
        />
        <Advertisement
          title="pranitha herbals"
          image={
            "https://d1q7rcky2z4kkl.cloudfront.net/public/sescommunityads_attachment/1e/0e/fdc9e3706f3036f8d81c5ebddce9c995.jpeg"
          }
          desc={"Testing the one line"}
        />
      </div>
    </div>
  );
}

export default UserCard;
