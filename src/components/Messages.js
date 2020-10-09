import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import "./Messages.css";
import Message from "./Message";
import { db } from "../firebase";
import MessageUser from "./MessageUser";

function Messages({ user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [currentUser, setCurrentUser] = useState("");
  const [friends, setFriends] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { key: 0, username: user.displayName, message: "Hi siva" },
    { key: 1, username: "siva", message: "Hi kiran" },
  ]);
  useEffect(() => {
    db.collection("chatRooms")
      .where("users", "array-contains", user.uid)
      .get()
      .then((doc) => {
        setFriends(doc.data().friends);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [user]);
  const sendMessage = (event) => {
    event.preventDefault();
    setInput("");
  };
  const setUser = (test) => {
    setCurrentUser(test);
  };
  console.log(friends);
  return (
    <div className="messages">
      <Header user={user} isActive="messages" />
      <div className="messages__container">
        <div className="messages__usersList">
          <div className="messages__header">
            <h2>Messages</h2>
          </div>
          <div className="messages__users">
            {/* {Object.keys(friends).map((key, i) => {
              if (friends[key] === 3) {
                return (
                  <div key={key}>
                    <MessageUser friendId={key} />
                  </div>
                );
              }
              return "";
            })} */}
          </div>
        </div>
        <div className="messages__viewContainer">
          <div className="messages__viewContainerHeader">
            <Avatar className="messages__userPic" />
            <h3>Kiran siva sai Tatipaka</h3>
          </div>
          <div className="messages__viewContainerBody">
            {messages.map((message) => (
              <Message
                key={message.key}
                message={message}
                username={user.displayName}
              />
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <div className="messages__viewContainerBottom">
              <input
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="messages__sendButton">Send</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messages;
