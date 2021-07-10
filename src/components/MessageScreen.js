import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Message from "./Message";
import firebase from "firebase";
import { animateScroll } from "react-scroll";
import FlipMove from "react-flip-move";

function MessageScreen({ cuserId, selectedUser, currentUser, user }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "messageContainerBody",
      duration: 100,
      delay: 100,
    });
  };
  useEffect(() => {
    if (currentUser) {
      db.collection("chatRooms")
        .doc(currentUser)
        .collection("chats")
        .orderBy("postedOn")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
          scrollToBottom();
        });
      selectedUser &&
        selectedUser.get().then((doc) => {
          setName(doc.data().name);
          setPic(doc.data().photoUrl);
        });
    }
  }, [currentUser, selectedUser, cuserId, user]);

  const sendMessage = (event) => {
    event.preventDefault();
    db.collection("chatRooms").doc(currentUser).collection("chats").add({
      message: input,
      postedBy: user.uid,
      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  return (
    <div className="messages__viewContainer">
      <div className="messages__viewContainerHeader">
        {selectedUser && <Avatar src={pic} className="messages__userPic" />}
        <h3> {name} </h3>
      </div>
      <div className="messages__viewContainerBody" id="messageContainerBody">
        <FlipMove>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message.data}
              userUid={user.uid}
            />
          ))}
        </FlipMove>
      </div>
      {currentUser && (
        <form onSubmit={sendMessage}>
          <div className="messages__viewContainerBottom">
            <input
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" className="messages__sendButton">
              Send
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MessageScreen;
