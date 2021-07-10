import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import "./Messages.css";
import { db } from "../firebase";
import MessageUser from "./MessageUser";
import MessageScreen from "./MessageScreen";

function Messages({ user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [currentUser, setCurrentUser] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [cuserId, setCuserId] = useState("");

  useEffect(() => {
    if (user) {
      db.collection("chatRooms")
        .where("users", "array-contains", user.uid)
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
                <div
                  key={friendId}
                  className={`${currentUser === friend.id && "activeUser"}`}
                  onClick={() => {
                    setCurrentUser(friend.id);
                    setSelectedUser(friend.data.userRef[friendId]);
                    setCuserId(friendId);
                  }}
                >
                  <MessageUser
                    key={friendId}
                    friendId={friend.data.userRef[friendId]}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <MessageScreen
          selectedUser={selectedUser}
          currentUser={currentUser}
          user={user}
          cuserId={cuserId}
        />
      </div>
    </div>
  );
}

export default Messages;
