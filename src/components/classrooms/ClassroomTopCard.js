import { Backdrop, Button, Fade, Modal } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import firebase from "firebase";
import "./ClassroomTopCard.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ClearIcon from "@material-ui/icons/Clear";
import ClassroomMembers from "./ClassroomMembers";

function ClassroomTopCard({ user, id }) {
  const [modalOpen, setModalOpen] = useState(false);
  const colors = [
    "#168400",
    "#1a0363",
    "#0d8491",
    "#890c1b",
    "#310891",
    "#b25c00",
    "#930301",
  ];

  const [clsPic, setClsPic] = useState("");
  const [clsName, setClsName] = useState("");
  const [members, setMembers] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clsDescription, setClsDescription] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("class_rooms")
        .doc(id)
        .get()
        .then((doc) => {
          setClsName(doc.data().name);
          setClsPic(doc.data().color);
          setMembers(doc.data().students);
          setPostsCount(doc.data().posts);
          setAdmins(doc.data().createdBy);
          setClsDescription(doc.data().description);
          if (doc.data().createdBy === user.uid) {
            setIsAdmin(true);
          }
          if (doc.data().students.includes(user.uid)) {
            setIsMember(true);
          }
        });
    }
  }, [id, user, isMember]);

  const leaveClassroom = (e) => {
    if (isAdmin) {
      alert("You cannot exit Classroom");
    } else {
      db.collection("classrooms")
        .doc(id)
        .update({
          members: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
      setIsMember(false);
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
            <ClassroomMembers
              isClassroomAdmin={isAdmin}
              admins={admins}
              members={members}
              user={user}
              classroomId={id}
            />
          </div>
        </Fade>
      </Modal>
      <div
        className="classroomTopCard"
        style={{
          backgroundColor: colors[clsPic],
        }}
      >
        <div className="classroomTopCard__right">
          <h1>{clsName}</h1>
          <div className="classroomTopCard__info">
            <p>
              <span className="classroomTopCard__infoHeader">
                {postsCount ? postsCount : 0}
              </span>
              &nbsp;Posts
            </p>
            <p
              className="classroomTopCard__mem"
              onClick={(e) => setModalOpen(true)}
            >
              <span className="classroomTopCard__infoHeader">
                {members.length}
              </span>
              &nbsp;Members
            </p>
          </div>
          <div className="classroomTopCard__action">
            {!isAdmin && (
              <Button
                startIcon={<ExitToAppIcon />}
                onClick={(e) => leaveClassroom(e)}
                className="leave__classroom"
              >
                Leave
              </Button>
            )}
          </div>

          <div className="classroomTopCard__bio">{clsDescription}</div>
        </div>
      </div>
    </>
  );
}

export default ClassroomTopCard;
