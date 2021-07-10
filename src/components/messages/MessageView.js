import React, { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import Message from "../Message";
import FlipMove from "react-flip-move";
import { Avatar, Button } from "@material-ui/core";
import firebase from "firebase";
import { animateScroll } from "react-scroll";

function MessageView({ user, id }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(0);
  const [chkFriends, setChkFriends] = useState(false);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [isMounted, setIsMounted] = useState(true);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "messageContainerBody",
      duration: 100,
      delay: 100,
    });
  };

  useEffect(() => {
    if (isMounted && user && id) {
      db.collection("chatRooms")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.data()) {
            setStatus(doc.data().status);
            if (doc.data().users.includes(user.uid)) {
              setChkFriends(true);
            }
            doc.data().users.forEach((element) => {
              if (element !== user.uid) {
                db.collection("users")
                  .doc(element)
                  .get()
                  .then((doc) => {
                    setName(doc.data().name);
                    setPic(doc.data().photoUrl);
                  });
              }
            });
          }
        });
      db.collection("chatRooms")
        .doc(id)
        .collection("chats")
        .orderBy("postedOn")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
          scrollToBottom();
        });
    }
    return () => setIsMounted(false);
  }, [user, id, isMounted]);
  const sendMessage = (event) => {
    event.preventDefault();
    if (input.trim()) {
      db.collection("chatRooms").doc(id).collection("chats").add({
        message: input,
        postedBy: user.uid,
        postedOn: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInput("");
  };

  if (chkFriends && status === 1) {
    return (
      <div className="messages__viewContainer">
        <div className="messages__viewContainerHeader">
          <Avatar src={pic} className="messages__userPic" />
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
          <div ref={setRef}></div>
        </div>
        <form onSubmit={sendMessage}>
          <div className="messages__viewContainerBottom">
            <input
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!input}
              className="messages__sendButton"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="messages__viewContainer">
      <div
        className="messages__viewContainerBody"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        id="messageContainerBody"
      >
        {id ? <></> : <h2>Select user to start chat</h2>}
      </div>
    </div>
  );
}

export default MessageView;
