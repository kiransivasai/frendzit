import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Post.css";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";

function Post({
  image,
  userData,
  timestamp,
  message,
  likes,
  userUid,
  postId,
  type,
}) {
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
  const [isLiked, setIsLiked] = useState(() => {
    if (likes && likes[userUid]) {
      return true;
    } else {
      return false;
    }
  });

  const toogleLikes = (e) => {
    if (likes) {
      likes[userUid] = !isLiked;
      db.collection("posts").doc(postId).update({
        likes: likes,
      });
    } else {
      likes = {};
      likes[userUid] = !isLiked;
      db.collection("posts").doc(postId).update({
        likes: likes,
      });
    }
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="post__top">
        <Avatar src={profilePic} className="post__avatar" />
        <div className="post__topInfo">
          <h3>{username}</h3>
          <p>{timestamp}</p>
        </div>
      </div>
      {message ? (
        <div className="post__bottom">
          <p> {message} </p>
        </div>
      ) : (
        <></>
      )}

      {image ? (
        type ? (
          <div className="post__video">
            <VideoCard src={image} />
          </div>
        ) : (
          <div className="post__image">
            <img src={image} alt="" />
          </div>
        )
      ) : (
        <></>
      )}

      <div className="post__options">
        <div className="post__option postLike__option" onClick={toogleLikes}>
          {isLiked ? (
            <FavoriteIcon className="liked__button" />
          ) : (
            <FavoriteBorderIcon className="postLike__button" />
          )}
          <p> {noLikes ? noLikes : 0}</p>
        </div>
        <Link to={"/post/" + postId} className="postComment__link">
          <div className="post__option postComment__option">
            <CommentIcon className="postComment__button" />
          </div>
        </Link>
        <div className="post__option postShare__option">
          <ShareIcon className="postShare__button" />
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default Post;
