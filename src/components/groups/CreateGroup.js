import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./CreateGroup.css";
import CloseIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";
import { db, storage } from "../../firebase";
import firebase from "firebase";

function CreateGroup({ user }) {
  const history = useHistory("");
  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };
  const enableScroll = () => {
    document.body.style.overflow = "";
  };
  disableScroll();
  const [grpName, setGrpName] = useState("");
  const [grpDescription, setGrpDescription] = useState("");
  const [grpPic, setGrpPic] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const acceptedFormats = ["jpeg", "jpg", "png", "mp4"];

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setGrpPic(e.target.files[0]);
      document.getElementById("grp__text").innerHTML = "Group Photo Uploaded";
    }
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
  const createGroup = (e) => {
    e.preventDefault();
    let timestamp = new Date().getTime().toString();
    if (!grpPic) {
      setErrMsg("Select Group Profile Picture");
    }
    if (grpPic && grpName && grpDescription) {
      const ext = grpPic.name.split(".").pop();
      if (acceptedFormats.includes(ext)) {
        storage
          .ref("groups/" + timestamp + "/profile.jpg")
          .put(grpPic)
          .then(() => {
            storage
              .ref("groups/" + timestamp + "/profile.jpg")
              .getDownloadURL()
              .then((imgUrl) => {
                db.collection("groups")
                  .add({
                    admins: [user.uid],
                    createdBy: db.collection("users").doc(user.uid),
                    createdOn: firebase.firestore.FieldValue.serverTimestamp(),
                    description: grpDescription,
                    keys: createKeywords(grpName),
                    members: [user.uid],
                    name: grpName,
                    pic: imgUrl,
                    posts: 0,
                  })
                  .then(() => {
                    setErrMsg("Group Created Successfully");
                    setGrpPic("");
                    setGrpDescription("");
                    setGrpName("");
                    enableScroll();
                    history.push("/groups");
                  })
                  .catch((error) => {
                    setErrMsg("Error creating Group");
                  });
              })
              .catch((error) => {
                setErrMsg("Error creating Group");
              });
          })
          .catch((error) => {
            setErrMsg("Error while uploading picture");
          });
      } else {
        setErrMsg("Invalid Profile Picture");
        setGrpPic("");
      }
    }
  };

  return (
    <div className="createGroup">
      <div className="createGroup__body">
        <div className="createGroup__top">
          <h3>Create Group</h3>
          <Link to="/groups" className="groupLink" onClick={enableScroll}>
            <CloseIcon className="groupCloseIcon" />
          </Link>
        </div>
        <div className="createGroup__center">
          <form onSubmit={createGroup}>
            <TextField
              className="createGroup__input"
              label="Group Name"
              variant="outlined"
              required={true}
              value={grpName}
              onChange={(e) => setGrpName(e.target.value)}
            />
            <TextField
              className="createGroup__input"
              label="Group Description"
              variant="outlined"
              multiline={true}
              rows={4}
              required={true}
              value={grpDescription}
              onChange={(e) => setGrpDescription(e.target.value)}
            />
            <Button
              className="grpProfilePicture"
              color="default"
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={(e) => document.getElementById("grpPic").click()}
            >
              Group Profile Picture
            </Button>
            <input
              type="file"
              id="grpPic"
              hidden
              onChange={(e) => handleChange(e)}
            />
            <span id="grp__text">{errMsg}</span>
            <Button
              type="submit"
              variant="contained"
              className="grpCreateButton"
            >
              Create Group
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
