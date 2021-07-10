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
import "./PageTopCard.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ClearIcon from "@material-ui/icons/Clear";
import PageMembers from "./PageMembers";

function PageTopCard({ user, id }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [pgPic, setPgPic] = useState("");
  const [pgName, setPgName] = useState("");
  const [members, setMembers] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pgDescription, setPgDescription] = useState("");
  const [pageEditOpen, setPageEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      db.collection("pages")
        .doc(id)
        .get()
        .then((doc) => {
          setPgName(doc.data().name);
          setPgPic(doc.data().pic);
          setMembers(doc.data().followers);
          setPostsCount(doc.data().posts);
          setAdmins(doc.data().createdBy);
          setPgDescription(doc.data().description);
          if (doc.data().createdBy === user.uid) {
            setIsAdmin(true);
          }
          if (doc.data().followers.includes(user.uid)) {
            setIsMember(true);
          }
        });
    }
  }, [id, user, isMember]);

  const leavePage = (e) => {
    if (isAdmin) {
      alert("You cannot exit Page");
    } else {
      db.collection("pages")
        .doc(id)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
      setIsMember(false);
    }
  };
  const joinPage = (e) => {
    db.collection("pages")
      .doc(id)
      .update({
        followers: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
    setIsMember(true);
  };

  const [changeDescription, setChangeDescription] = useState("");
  const [changeName, setChangeName] = useState("");

  const openModal = (e) => {
    setChangeDescription(pgDescription);
    setChangeName(pgName);
    setPageEditOpen(true);
  };
  const editProfile = (e) => {
    e.preventDefault();
    setPgName(changeName);
    setPgDescription(changeDescription);
    db.collection("pages")
      .doc(id)
      .update({
        name: changeName,
        description: changeDescription,
        keys: createKeywords(changeName),
      });
    setPageEditOpen(false);
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
  const handleDp = (e) => {
    document.getElementById("changeProfile_picture").click();
  };
  const handleChange = (e) => {
    let timestamp = new Date().getTime().toString();
    if (e.target.files[0]) {
      storage
        .ref("pages/" + timestamp + "/profile.jpg")
        .put(e.target.files[0])
        .then(() => {
          storage
            .ref("pages/" + timestamp + "/profile.jpg")
            .getDownloadURL()
            .then((imgUrl) => {
              setPgPic(imgUrl);
              db.collection("pages").doc(id).update({
                pic: imgUrl,
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
            <PageMembers
              isPageAdmin={isAdmin}
              admins={admins}
              members={members}
              user={user}
              pageId={id}
            />
          </div>
        </Fade>
      </Modal>
      <Modal
        open={pageEditOpen}
        onClose={(e) => setPageEditOpen(false)}
        closeAfterTransition={true}
        className="modalBox"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={pageEditOpen}>
          <div className="modalPaper">
            <div className="modalBox__top">
              <div className="modalBox__left">
                <h4>Edit Bio</h4>
              </div>
              <div
                className="modalBox__right"
                onClick={(e) => setPageEditOpen(false)}
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
      <div className="pageTopCard">
        <div className="pageTopCard__left">
          <Avatar
            className="pageTopCard__pic"
            src={pgPic}
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
        <div className="pageTopCard__right">
          <h1>{pgName}</h1>
          <div className="pageTopCard__info">
            <p>
              <span className="pageTopCard__infoHeader">{postsCount}</span>
              &nbsp;Posts
            </p>
            <p className="pageTopCard__mem" onClick={(e) => setModalOpen(true)}>
              <span className="pageTopCard__infoHeader">{members.length}</span>
              &nbsp;Members
            </p>
          </div>
          <div className="pageTopCard__action">
            {isMember ? (
              <Button
                startIcon={<ExitToAppIcon />}
                onClick={(e) => leavePage(e)}
                className="leave__page"
              >
                Leave
              </Button>
            ) : (
              <Button
                startIcon={<AddCircleIcon />}
                onClick={(e) => joinPage(e)}
                className="join__page"
              >
                Follow
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

          <div className="pageTopCard__bio">{pgDescription}</div>
        </div>
      </div>
    </>
  );
}

export default PageTopCard;
