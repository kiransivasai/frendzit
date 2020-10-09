import React from "react";
import "./Message.css";

function Message({ username, message }) {
  const isUser = username === message.username;
  return (
    <div className={`message ${isUser && "message__user"}`}>
      <h3>{message.message}</h3>
    </div>
  );
}
export default Message;
