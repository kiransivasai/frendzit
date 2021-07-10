import React, { useState } from "react";
import { db, storage } from "../../firebase";
import "./EntUploader.css";
import firebase from "firebase/app";
import { Avatar, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

function EntUploader({ src, user }) {
  const [postImage, setPostImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const acceptedFormats = ["mp3", "mp4"];
  const [uploadStatus, setUploadStatus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      if (postImage) {
        const ext = postImage.name.split(".").pop();
        const name = new Date().getTime().toString() + "." + ext;
        if (acceptedFormats.includes(ext)) {
          setUploadStatus(true);
          if (ext === "mp4") {
            storage
              .ref("entertainment/" + name)
              .put(postImage)
              .then(() => {
                storage
                  .ref("entertainment/" + name)
                  .getDownloadURL()
                  .then((imgUrl) => {
                    db.collection("entertainment").add({
                      resource: imgUrl,
                      type: 0,
                      postedBy: user.uid,
                      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    setUploadStatus(false);
                  })
                  .catch((error) => {
                    setErrorMsg(error.message);
                  });
              })
              .catch((error) => {
                setErrorMsg("Error while uploading Post");
              });
          } else {
            setUploadStatus(true);
            storage
              .ref("entertainment/" + name)
              .put(postImage)
              .then(() => {
                storage
                  .ref("entertainment/" + name)
                  .getDownloadURL()
                  .then((imgUrl) => {
                    db.collection("entertainment").add({
                      resource: imgUrl,
                      type: 1,
                      postedBy: user.uid,
                      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    setUploadStatus(false);
                  })
                  .catch((error) => {
                    setErrorMsg(error.message);
                  });
              })
              .catch((error) => {
                setErrorMsg("Error while uploading Post");
              });
          }
        }
      } else {
        setErrorMsg("Please select Audio/Video to add Posts");
      }
    }

    setPostImage("");
    document.getElementById("up_text").innerHTML = "";
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
      document.getElementById("up_text").innerHTML =
        "Post Video/Audio Selected";
    }
  };
  const handleDp = (e) => {
    document.getElementById("post_picture").click();
  };
  return (
    <div className="entUploader">
      <form onSubmit={handleSubmit}>
        <div className="entUploader__top">
          <Avatar src={src} />

          <div className="entUploader__option" onClick={handleDp}>
            <Button
              type="button"
              startIcon={<AddIcon />}
              className="entpostUpload__button"
            >
              Audio/Video
            </Button>
            <input
              type="file"
              id="post_picture"
              onChange={handleChange}
              hidden
            />
          </div>
          <Button
            type="submit"
            disabled={!postImage}
            className="entUploader__button"
          >
            Post
          </Button>
        </div>
        <div className="entUploader__error">
          <h3 id="up_text">{errorMsg}</h3>
          <h3>{uploadStatus && "File Uploading, Please Wait"}</h3>
        </div>
      </form>
    </div>
  );
}

export default EntUploader;
