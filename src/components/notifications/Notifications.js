import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Notification from "./Notification";
import "./Notifications.css";
import moment from "moment";

function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    db.collection("notifications")
      .where("recievers", "array-contains", user.uid)
      .orderBy("createdOn", "desc")
      .onSnapshot((snapshot) => {
        setNotifications(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [user]);
  return (
    <div className="notifications">
      <Header user={user} isActive="notifications" />
      <div className="notifications__body">
        <Sidebar user={user} isActive="notifications" />
        <div className="notifications__list">
          <h1>Notifications</h1>
          {notifications.length === 0 && (
            <div className="noNotifications">
              <h2>No New Notifications</h2>
            </div>
          )}
          {notifications.map((notification) => (
            <div key={notification.id}>
              {notification.data.notificationType === "GROUP_POST" && (
                <Link
                  className="notification__link"
                  to={"/grp/" + notification.data.id}
                >
                  <Notification
                    message={notification.data.message}
                    photoUrl={notification.data.photoUrl}
                    type={notification.data.type}
                    key={notification.id}
                    createdOn={moment(
                      notification.data.createdOn?.toDate()
                    ).calendar()}
                    notificationId={notification.id}
                    user={user}
                  />
                </Link>
              )}
              {notification.data.notificationType === "RECEIVED" && (
                <Link
                  className="notification__link"
                  to={"/users/" + notification.data.id}
                >
                  <Notification
                    message={notification.data.message}
                    photoUrl={notification.data.photoUrl}
                    type={notification.data.type}
                    key={notification.id}
                    createdOn={moment(
                      notification.data.createdOn?.toDate()
                    ).calendar()}
                    notificationId={notification.id}
                    user={user}
                  />
                </Link>
              )}
              {notification.data.notificationType === "ACCEPTED" && (
                <Link
                  className="notification__link"
                  to={"/users/" + notification.data.id}
                >
                  <Notification
                    message={notification.data.message}
                    photoUrl={notification.data.photoUrl}
                    type={notification.data.type}
                    key={notification.id}
                    createdOn={moment(
                      notification.data.createdOn?.toDate()
                    ).calendar()}
                    notificationId={notification.id}
                    user={user}
                  />
                </Link>
              )}
              {notification.data.notificationType === "PAGE_POST" && (
                <Link
                  className="notification__link"
                  to={"/pg/" + notification.data.id}
                >
                  <Notification
                    message={notification.data.message}
                    photoUrl={notification.data.photoUrl}
                    type={notification.data.type}
                    key={notification.id}
                    createdOn={moment(
                      notification.data.createdOn?.toDate()
                    ).calendar()}
                    notificationId={notification.id}
                    user={user}
                  />
                </Link>
              )}
              {notification.data.notificationType === "CLASS_POST" && (
                <Link
                  className="notification__link"
                  to={"/cls/" + notification.data.id}
                >
                  <Notification
                    message={notification.data.message}
                    photoUrl={notification.data.photoUrl}
                    type={notification.data.type}
                    key={notification.id}
                    createdOn={moment(
                      notification.data.createdOn?.toDate()
                    ).calendar()}
                    notificationId={notification.id}
                    user={user}
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
