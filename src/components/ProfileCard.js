import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { db } from "../firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function ProfileCard({ user, id }) {
  const [username, setUsername] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [friends, setFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [friendState, setFriendState] = useState(2);
  useEffect(() => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        setUsername(doc.data().name);
        setPhotoUrl(doc.data().photoUrl);
        setFriends(doc.data().friends);
        setPostCount(doc.data().postCount);
      });
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        setMyFriends(doc.data().friends);
      });
    if (
      !friends ||
      friends[user.uid] === undefined ||
      friends[user.uid] === 2
    ) {
      setFriendState(2);
    } else {
      setFriendState(friends[user.uid]);
    }
  }, [id, user, friends]);
  const changeFriendStatus = () => {
    if (friendState === 1) {
      setFriendState(2);
      friends[user.uid] = 2;
      myFriends[id] = 2;
      db.collection("users").doc(id).update({
        friends: friends,
      });
      db.collection("users").doc(user.uid).update({
        friends: myFriends,
      });
    } else if (friendState === 0) {
      setFriendState(3);
      friends[user.uid] = 3;
      myFriends[id] = 3;
      db.collection("users").doc(id).update({
        friends: friends,
      });
      db.collection("users").doc(user.uid).update({
        friends: myFriends,
      });
    } else if (friendState === 2) {
      setFriendState(1);
      if (friends) {
        if (myFriends) {
          friends[user.uid] = 1;
          myFriends[id] = 0;
          db.collection("users").doc(id).update({
            friends: friends,
          });
          db.collection("users").doc(user.uid).update({
            friends: myFriends,
          });
        } else {
          let temp2 = {};
          friends[user.uid] = 1;
          temp2[id] = 0;
          db.collection("users").doc(id).update({
            friends: friends,
          });
          db.collection("users").doc(user.uid).update({
            friends: temp2,
          });
        }
      } else {
        if (myFriends) {
          let temp = {};
          myFriends[id] = 0;
          temp[user.uid] = 1;
          db.collection("users").doc(id).update({
            friends: temp,
          });
          db.collection("users").doc(user.uid).update({
            friends: myFriends,
          });
        } else {
          let temp1 = {};
          let temp2 = {};
          temp1[id] = 0;
          temp2[user.uid] = 1;
          db.collection("users").doc(id).update({
            friends: temp2,
          });
          db.collection("users").doc(user.uid).update({
            friends: temp1,
          });
        }
      }
    } else if (friendState === 3) {
      setFriendState(2);
      friends[user.uid] = 2;
      myFriends[id] = 2;
      db.collection("users").doc(id).update({
        friends: friends,
      });
      db.collection("users").doc(user.uid).update({
        friends: myFriends,
      });
    }
  };
  let button;
  if (friendState === 1) {
    button = (
      <Button
        onClick={changeFriendStatus}
        className="pendingButton"
        startIcon={<AccessAlarmIcon />}
      >
        Pending
      </Button>
    );
  } else if (friendState === 0) {
    button = (
      <Button
        onClick={changeFriendStatus}
        className="acceptButton"
        startIcon={<CheckCircleIcon />}
      >
        Accept Request
      </Button>
    );
  } else if (friendState === 2) {
    button = (
      <Button
        onClick={changeFriendStatus}
        className="followButton"
        startIcon={<PersonAddIcon />}
      >
        Add Friend
      </Button>
    );
  } else if (friendState === 3) {
    button = (
      <Button
        onClick={changeFriendStatus}
        className="unFollowButton"
        startIcon={<CancelIcon />}
      >
        Unfriend
      </Button>
    );
  }

  return (
    <div className="profileCard">
      <div className="profileCard__left">
        <Avatar src={photoUrl} style={{ width: "125px", height: "125px" }} />
      </div>
      <div className="profileCard__right">
        <h1>{username}</h1>
        <div className="profileCard__info">
          <p>
            <span className="profileCard__infoHeader">
              {postCount ? postCount : 0}
            </span>
            Posts
          </p>
          <p>
            <span className="profileCard__infoHeader">76</span> Friends
          </p>
          {button}
        </div>

        <div className="profileCard__bio">
          <p>This is a sample bio</p>
          <p>Here goes your interest</p>
          <p>Here is the date of birth 15-11-2000</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
