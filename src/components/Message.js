import moment from "moment";
import React, { forwardRef } from "react";
import "./Message.css";
import Linkify from "react-linkify";

const Message = forwardRef(({ userUid, message }, ref) => {
  const isUser = userUid === message.postedBy;
  return (
    <div ref={ref} className={`message ${isUser && "message__user"}`}>
      <h3>
        <Linkify>{message.message}</Linkify>
      </h3>

      <p>{moment(message.postedOn?.toDate()).fromNow()}</p>
    </div>
  );
});
export default Message;
