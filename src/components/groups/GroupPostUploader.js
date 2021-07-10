import React, { useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import { Avatar, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import "./GroupPostUploader.css";

function GroupPostUploader({ id, user }) {
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const acceptedFormats = ["jpeg", "jpg", "png", "mp4"];
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
              .ref("posts/" + user.uid + "/" + name)
              .put(postImage)
              .then(() => {
                storage
                  .ref("posts/" + user.uid + "/" + name)
                  .getDownloadURL()
                  .then((imgUrl) => {
                    db.collection("group_posts").add({
                      description: postText,
                      resources: imgUrl,
                      group: id,
                      type: 1,
                      postedBy: user.uid,
                      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
                      userData: db.collection("users").doc(user.uid),
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
              .ref("posts/" + user.uid + "/" + name)
              .put(postImage)
              .then(() => {
                storage
                  .ref("posts/" + user.uid + "/" + name)
                  .getDownloadURL()
                  .then((imgUrl) => {
                    db.collection("group_posts").add({
                      description: postText,
                      resources: imgUrl,
                      type: 0,
                      postedBy: user.uid,
                      group: id,
                      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
                      userData: db.collection("users").doc(user.uid),
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
      } else if (postText.trim()) {
        db.collection("group_posts").add({
          description: postText,
          type: 0,
          postedBy: user.uid,
          group: id,
          postedOn: firebase.firestore.FieldValue.serverTimestamp(),
          userData: db.collection("users").doc(user.uid),
          resources: null,
        });
      } else {
        setErrorMsg("Please select Image/Video/Description to add Posts");
      }
    }

    setPostText("");
    setPostImage("");
    document.getElementById("up_text").innerHTML = "";
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
      document.getElementById("up_text").innerHTML =
        "Post Video/Image Selected";
    }
  };
  const handleDp = (e) => {
    document.getElementById("post_picture").click();
  };
  return (
    <div className="GrpPostUploader">
      <form onSubmit={handleSubmit}>
        <div className="GrpPostUploader__top">
          <Avatar src={user.photoURL} />
          <input
            className="GrpPostUploader__input"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`Share Your Ideas with your friends`}
          />

          <div className="GrpPostUploader__option" onClick={handleDp}>
            <Button startIcon={<AddIcon />} className="GrpPostUpload__button">
              Photo/Video
            </Button>
            <input
              type="file"
              id="post_picture"
              onChange={handleChange}
              hidden
            />
          </div>
        </div>

        <div className="GrpPostUploader__bottom">
          <Button
            type="submit"
            disabled={!postText && !postImage}
            className="GrpPostUploader__button"
          >
            Post
          </Button>
        </div>
        <div className="GrpPostUploader__error">
          <h3 id="up_text">{errorMsg}</h3>
          <h3>{uploadStatus && "File Uploading, Please Wait"}</h3>
        </div>
      </form>
    </div>
  );
}

export default GroupPostUploader;
