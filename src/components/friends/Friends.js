import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import Header from "../Header";
import Sidebar from "../Sidebar";
import UserCard from "../UserCard";
import Friend from "./Friend";
import "./Friends.css";

function Friends({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }

  const [allfriends, setAllFriends] = useState([]);
  useEffect(() => {
    id
      ? db
          .collection("users")
          .doc(id)
          .get()
          .then((doc) => {
            if (doc.data()) {
              setAllFriends(doc.data().friends);
            }
          })
      : db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              setAllFriends(doc.data().friends);
            }
          });
  }, [user, id]);

  return (
    <div className="friends">
      <Header user={user} />
      <div className="friends__body">
        <Sidebar
          user={user}
          isActive={user.uid === id || id === undefined ? "friends" : ""}
        />
        <div className="friends__list">
          {(user.uid === id || id === undefined) && (
            <>
              <h2>Friend Requests</h2>
              {allfriends &&
                Object.keys(allfriends).map((friend) => {
                  if (allfriends[friend] === 1) {
                    return (
                      <Link
                        to={"/users/" + friend}
                        className="friendLink"
                        key={friend}
                      >
                        <Friend key={friend} id={friend} />
                      </Link>
                    );
                  }
                  return "";
                })}
            </>
          )}

          <h2>Friends</h2>
          {allfriends &&
            Object.keys(allfriends).map((friend) => {
              if (allfriends[friend] === 3) {
                return (
                  <Link
                    to={"/users/" + friend}
                    className="friendLink"
                    key={friend}
                  >
                    <Friend key={friend} id={friend} />
                  </Link>
                );
              }
              return "";
            })}
        </div>
        <UserCard user={user} />
      </div>
    </div>
  );
}

export default Friends;
