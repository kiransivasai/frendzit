import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import Header from "../Header";
import MessageUser from "../MessageUser";
import "./Messages.css";
import MessageView from "./MessageView";

function Messages({ id, user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("chatRooms")
        .where("users", "array-contains", user.uid)
        .where("status", "==", 1)
        .orderBy("lastPostedOn", "desc")
        .onSnapshot((snapshot) => {
          setFriends(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  }, [user]);

  return (
    <div className="messages">
      <Header user={user} isActive="messages" />
      <div className="messages__container">
        <div className="messages__usersList">
          <div className="messages__header">
            <h2>Messages</h2>
          </div>
          <div className="messages__users">
            {friends.map((friend) => {
              let friendId;
              friend.data.users.forEach((element) => {
                if (element !== user.uid) {
                  friendId = element;
                }
              });
              return (
                <Link
                  key={friend.id}
                  to={"/message/" + friend.id}
                  className="messageUser__link"
                >
                  <div
                    key={friendId}
                    className={`${id === friend.id && "activeUser"}`}
                  >
                    <MessageUser
                      key={friendId}
                      friendId={friend.data.userRef[friendId]}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <MessageView key={id} id={id} user={user} />
      </div>
    </div>
  );
}

export default Messages;
