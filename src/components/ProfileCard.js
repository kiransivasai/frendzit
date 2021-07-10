import {
  Avatar,
  Backdrop,
  Button,
  Fade,
  Modal,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { db, auth, storage } from "../firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Link } from "react-router-dom";
import ClearIcon from "@material-ui/icons/Clear";

function ProfileCard({ user, id }) {
  const [username, setUsername] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [friends, setFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [description, setDescription] = useState("");
  const [friendState, setFriendState] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [changeDescription, setChangeDescription] = useState("");
  const [changeName, setChangeName] = useState("");

  useEffect(() => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        setUsername(doc.data().name);
        setPhotoUrl(doc.data().photoUrl);
        setFriends(doc.data().friends);
        setDescription(doc.data().description);
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

  const cancelRequest = () => {
    setFriendState(2);
    friends[user.uid] = 2;
    myFriends[id] = 2;
    db.collection("users").doc(id).update({
      friends: friends,
    });
    db.collection("users").doc(user.uid).update({
      friends: myFriends,
    });
  };
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
      <>
        <Button className="pendingButton" startIcon={<AccessAlarmIcon />}>
          Pending
        </Button>
        <Button
          onClick={changeFriendStatus}
          className="cancelButton"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      </>
    );
  } else if (friendState === 0) {
    button = (
      <>
        <Button
          onClick={changeFriendStatus}
          className="acceptButton"
          startIcon={<CheckCircleIcon />}
        >
          Accept
        </Button>
        <Button
          onClick={cancelRequest}
          className="cancelButton"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      </>
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
  const openModal = (e) => {
    setChangeDescription(description);
    setChangeName(username);
    setModalOpen(true);
  };
  const createKeywords = (name) => {
    name = name.toLowerCase();
    const result = [];
    var i, j;
    for (i = 0; i < name.length; i++) {
      for (j = i + 1; j < name.length + 1; j++) {
        result.push(name.slice(i, j));
      }
    }
    return result;
  };
  const editProfile = (e) => {
    e.preventDefault();
    auth.currentUser.updateProfile({
      displayName: changeName,
    });
    db.collection("users")
      .doc(user.uid)
      .update({
        name: changeName,
        description: changeDescription,
        keys: createKeywords(changeName),
      });
    setModalOpen(false);
  };
  const handleDp = (e) => {
    document.getElementById("changeProfile_picture").click();
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      storage
        .ref("users/" + user.uid + "/profile.jpg")
        .put(e.target.files[0])
        .then(() => {
          storage
            .ref("users/" + user.uid + "/profile.jpg")
            .getDownloadURL()
            .then((imgUrl) => {
              auth.currentUser.updateProfile({
                photoURL: imgUrl,
              });
              db.collection("users").doc(user.uid).update({
                photoUrl: imgUrl,
              });
            });
        });
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={(e) => setModalOpen(false)}
        closeAfterTransition={true}
        className="profileModalBox"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className="profileModalPaper">
            <div className="profileModalBox__top">
              <div className="profileModalBox__left">
                <h4>Edit Bio</h4>
              </div>
              <div
                className="profileModalBox__right"
                onClick={(e) => setModalOpen(false)}
              >
                <ClearIcon className="clearIcon" />
              </div>
            </div>
            <form
              className="editProfile__form"
              onSubmit={(e) => editProfile(e)}
            >
              <TextField
                className="editProfile__input"
                label="Name"
                variant="outlined"
                required={true}
                value={changeName}
                onChange={(e) => setChangeName(e.target.value)}
              />
              <TextField
                className="editProfile__input"
                label="Description"
                variant="outlined"
                multiline={true}
                rows={4}
                required={true}
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
              />
              <Button className="editProfile__button" type="submit">
                Edit
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
      <div className="profileCard">
        <div className="profileCard__left">
          <Avatar
            className="profileCard__pic"
            src={photoUrl}
            style={{ width: "125px", height: "125px" }}
          />
          {user.uid === id && (
            <>
              <input
                type="file"
                onChange={(e) => handleChange(e)}
                id="changeProfile_picture"
                hidden={true}
              />
              <Button className="changeProfilePic" onClick={(e) => handleDp(e)}>
                Change
              </Button>
            </>
          )}
        </div>
        <div className="profileCard__right">
          <h1>{username}</h1>
          <div className="profileCard__info">
            <p>
              <span className="profileCard__infoHeader">
                {postCount ? postCount : 0}
              </span>
              &nbsp;Posts
            </p>
            <Link
              to={user.uid !== id ? "/friend/" + id : "/friends"}
              className="profileCard__link"
            >
              <p>
                <span className="profileCard__infoHeader">
                  {friends
                    ? Object.values(friends)?.reduce(
                        (pre, cur) => (cur === 3 ? ++pre : pre),
                        0
                      )
                    : 0}
                </span>
                &nbsp;Friends
              </p>
            </Link>
          </div>
          <div className="profileCard__action">
            {user.uid !== id && button}
            {user.uid === id && (
              <Button
                onClick={(e) => openModal(e)}
                className="profileCard__edit"
              >
                Edit Profile
              </Button>
            )}
          </div>

          <div className="profileCard__bio">{description}</div>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;
