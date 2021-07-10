import {
  Avatar,
  Backdrop,
  Button,
  Fade,
  Modal,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import "./GroupTopCard.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ClearIcon from "@material-ui/icons/Clear";
import GroupMembers from "./GroupMembers";

function GroupTopCard({ user, id }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [grpPic, setGrpPic] = useState("");
  const [grpName, setGrpName] = useState("");
  const [members, setMembers] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [grpDescription, setGrpDescription] = useState("");

  const [changeDescription, setChangeDescription] = useState("");
  const [changeName, setChangeName] = useState("");
  const [groupEditOpen, setGroupEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      db.collection("groups")
        .doc(id)
        .get()
        .then((doc) => {
          setGrpName(doc.data().name);
          setGrpPic(doc.data().pic);
          setMembers(doc.data().members);
          setPostsCount(doc.data().posts);
          setAdmins(doc.data().admins);
          setGrpDescription(doc.data().description);
          if (doc.data().admins.includes(user.uid)) {
            setIsAdmin(true);
          }
          if (doc.data().members.includes(user.uid)) {
            setIsMember(true);
          }
        });
    }
  }, [id, user, isMember]);

  const leaveGroup = (e) => {
    if (isAdmin) {
      if (admins.length > 1) {
        db.collection("groups")
          .doc(id)
          .update({
            admins: firebase.firestore.FieldValue.arrayRemove(user.uid),
            members: firebase.firestore.FieldValue.arrayRemove(user.uid),
          });
        setIsMember(false);
        setIsAdmin(false);
      } else {
        alert("You cannot exit Group");
      }
    } else {
      db.collection("groups")
        .doc(id)
        .update({
          members: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
      setIsMember(false);
    }
  };
  const joinGroup = (e) => {
    db.collection("groups")
      .doc(id)
      .update({
        members: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
    setIsMember(true);
  };
  const handleDp = (e) => {
    document.getElementById("changeProfile_picture").click();
  };
  const handleChange = (e) => {
    let timestamp = new Date().getTime().toString();
    if (e.target.files[0]) {
      storage
        .ref("groups/" + timestamp + "/profile.jpg")
        .put(e.target.files[0])
        .then(() => {
          storage
            .ref("groups/" + timestamp + "/profile.jpg")
            .getDownloadURL()
            .then((imgUrl) => {
              setGrpPic(imgUrl);
              db.collection("groups").doc(id).update({
                pic: imgUrl,
              });
            });
        });
    }
  };
  const openModal = (e) => {
    setChangeDescription(grpDescription);
    setChangeName(grpName);
    setGroupEditOpen(true);
  };
  const editProfile = (e) => {
    e.preventDefault();
    setGrpName(changeName);
    setGrpDescription(changeDescription);
    db.collection("groups")
      .doc(id)
      .update({
        name: changeName,
        description: changeDescription,
        keys: createKeywords(changeName),
      });
    setGroupEditOpen(false);
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

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={(e) => setModalOpen(false)}
        closeAfterTransition={true}
        className="modalBox"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className="modalPaper">
            <div className="modalBox__top">
              <div className="modalBox__left">
                <h4>Members</h4>
              </div>
              <div
                className="modalBox__right"
                onClick={(e) => setModalOpen(false)}
              >
                <ClearIcon className="clearIcon" />
              </div>
            </div>
            <GroupMembers
              isGroupAdmin={isAdmin}
              admins={admins}
              members={members}
              user={user}
              groupId={id}
            />
          </div>
        </Fade>
      </Modal>
      <Modal
        open={groupEditOpen}
        onClose={(e) => setGroupEditOpen(false)}
        closeAfterTransition={true}
        className="modalBox"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={groupEditOpen}>
          <div className="modalPaper">
            <div className="modalBox__top">
              <div className="modalBox__left">
                <h4>Edit Bio</h4>
              </div>
              <div
                className="modalBox__right"
                onClick={(e) => setGroupEditOpen(false)}
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
      <div className="groupTopCard">
        <div className="groupTopCard__left">
          <Avatar
            className="group__avatar"
            src={grpPic}
            style={{ width: "125px", height: "125px" }}
          />
          {isAdmin && (
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
        <div className="groupTopCard__right">
          <h1>{grpName}</h1>
          <div className="groupTopCard__info">
            <p>
              <span className="groupTopCard__infoHeader">{postsCount}</span>
              &nbsp;Posts
            </p>
            <p
              className="groupTopCard__mem"
              onClick={(e) => setModalOpen(true)}
            >
              <span className="groupTopCard__infoHeader">{members.length}</span>
              &nbsp;Members
            </p>
          </div>
          <div className="groupTopCard__action">
            {isMember ? (
              <Button
                startIcon={<ExitToAppIcon />}
                onClick={(e) => leaveGroup(e)}
                className="leave__group"
              >
                Leave
              </Button>
            ) : (
              <Button
                startIcon={<AddCircleIcon />}
                onClick={(e) => joinGroup(e)}
                className="join__group"
              >
                Join Group
              </Button>
            )}
            <div className="pageCard__action">
              {isAdmin && (
                <Button
                  onClick={(e) => openModal(e)}
                  className="pageCard__edit"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="groupTopCard__bio">{grpDescription}</div>
        </div>
      </div>
    </>
  );
}

export default GroupTopCard;
