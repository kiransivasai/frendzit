import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./CreatePage.css";
import CloseIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";
import { db, storage } from "../../firebase";
import firebase from "firebase";

function CreatePage({ user }) {
  const history = useHistory("");
  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };
  const enableScroll = () => {
    document.body.style.overflow = "";
  };
  disableScroll();
  const [pgName, setGrpName] = useState("");
  const [pgDescription, setGrpDescription] = useState("");
  const [pgPic, setGrpPic] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const acceptedFormats = ["jpeg", "jpg", "png", "mp4"];

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setGrpPic(e.target.files[0]);
      document.getElementById("pg__text").innerHTML = "Page Photo Uploaded";
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
  const createPage = (e) => {
    e.preventDefault();
    let timestamp = new Date().getTime().toString();
    if (!pgPic) {
      setErrMsg("Select Page Profile Picture");
    }
    if (pgPic && pgName && pgDescription) {
      const ext = pgPic.name.split(".").pop();
      if (acceptedFormats.includes(ext)) {
        storage
          .ref("pages/" + timestamp + "/profile.jpg")
          .put(pgPic)
          .then(() => {
            storage
              .ref("pages/" + timestamp + "/profile.jpg")
              .getDownloadURL()
              .then((imgUrl) => {
                db.collection("pages")
                  .add({
                    createdBy: user.uid,
                    createdOn: firebase.firestore.FieldValue.serverTimestamp(),
                    description: pgDescription,
                    keys: createKeywords(pgName),
                    followers: [user.uid],
                    name: pgName,
                    pic: imgUrl,
                    posts: 0,
                  })
                  .then(() => {
                    setErrMsg("Page Created Successfully");
                    setGrpPic("");
                    setGrpDescription("");
                    setGrpName("");
                    enableScroll();
                    history.push("/pages");
                  })
                  .catch((error) => {
                    setErrMsg("Error creating Page");
                  });
              })
              .catch((error) => {
                setErrMsg("Error creating Page");
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
    <div className="createPage">
      <div className="createPage__body">
        <div className="createPage__top">
          <h3>Create Page</h3>
          <Link to="/pages" className="pageLink" onClick={enableScroll}>
            <CloseIcon className="pageCloseIcon" />
          </Link>
        </div>
        <div className="createPage__center">
          <form onSubmit={createPage}>
            <TextField
              className="createPage__input"
              label="Page Name"
              variant="outlined"
              required={true}
              value={pgName}
              onChange={(e) => setGrpName(e.target.value)}
            />
            <TextField
              className="createPage__input"
              label="Page Description"
              variant="outlined"
              multiline={true}
              rows={4}
              required={true}
              value={pgDescription}
              onChange={(e) => setGrpDescription(e.target.value)}
            />
            <Button
              className="pgProfilePicture"
              color="default"
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={(e) => document.getElementById("pgPic").click()}
            >
              Page Profile Picture
            </Button>
            <input
              type="file"
              id="pgPic"
              hidden
              onChange={(e) => handleChange(e)}
            />
            <span id="pg__text">{errMsg}</span>
            <Button
              type="submit"
              variant="contained"
              className="pgCreateButton"
            >
              Create Page
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
