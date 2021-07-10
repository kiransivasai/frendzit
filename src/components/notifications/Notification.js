import React from "react";
import { db } from "../../firebase";
import firebase from "firebase";

function Notification({
  message,
  photoUrl,
  type,
  createdOn,
  notificationId,
  user,
}) {
  const deleteNotification = (e) => {
    db.collection("notifications")
      .doc(notificationId)
      .update({
        recievers: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
  };
  return (
    <div className="notification" onClick={deleteNotification}>
      <div className="notification__top">
        <h3>{message}</h3>
        <h5>{createdOn}</h5>
      </div>
      {type === 0 && (
        <>{photoUrl && <img src={photoUrl} alt="notification" />}</>
      )}
    </div>
  );
}

export default Notification;
