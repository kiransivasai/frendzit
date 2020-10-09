import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import "./PostView.css";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { db } from "../firebase";
import { Avatar } from "@material-ui/core";
import moment from "moment";
import CommentView from "./CommentView";

function PostView({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [userData, setUserData] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  var [likes, setLikes] = useState();
  const [timestamp, setTimestamp] = useState();

  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    db.collection("posts")
      .doc(id)
      .get()
      .then((doc) => {
        setUserData(doc.data().userData);
        setMessage(doc.data().description);
        setImage(doc.data().resources);
        setLikes(doc.data().likes);
        setTimestamp(doc.data().postedOn);
      });
    if (likes && likes[user.uid]) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [id, isLiked, user.uid, likes]);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");

  const noLikes = likes
    ? Object.values(likes)?.reduce((a, v) => (v === true ? a + 1 : a), 0)
    : 0;

  userData
    ? userData.get().then((doc) => {
        setProfilePic(doc.data().photoUrl);
        setUsername(doc.data().name);
      })
    : console.log("anonymus");

  const toogleLikes = (e) => {
    if (likes) {
      likes[user.uid] = !isLiked;
      db.collection("posts").doc(id).update({
        likes: likes,
      });
    } else {
      likes = {};
      likes[user.uid] = !isLiked;
      db.collection("posts").doc(id).update({
        likes: likes,
      });
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="postView">
      <Header user={user} />
      <div className="postView__body">
        <div className="postView__left">
          <div className="postView__top">
            <Avatar src={profilePic} className="postView__avatar" />
            <div className="postView__topInfo">
              <h3>{username}</h3>
              <p>{moment(timestamp?.toDate()).calendar()}</p>
            </div>
          </div>
          {message ? (
            <div className="postView__bottom">
              <p> {message} </p>
            </div>
          ) : (
            <></>
          )}

          {image ? (
            <div className="postView__image">
              <img src={image} alt="" />
            </div>
          ) : (
            <></>
          )}

          <div className="postView__options">
            <div
              className="postView__option postLike__option"
              onClick={toogleLikes}
            >
              {isLiked ? (
                <FavoriteIcon className="liked__button" />
              ) : (
                <FavoriteBorderIcon className="postLike__button" />
              )}
              <p> {noLikes ? noLikes : 0}</p>
            </div>

            <div className="postView__option postComment__option">
              <CommentIcon className="postComment__button" />
              <p>900</p>
            </div>

            <div className="postView__option postShare__option">
              <ShareIcon className="postShare__button" />
              <p></p>
            </div>
          </div>
        </div>
        <div className="postView__right">
          <CommentView postId={id} user={user} />
        </div>
      </div>
    </div>
  );
}

export default PostView;
