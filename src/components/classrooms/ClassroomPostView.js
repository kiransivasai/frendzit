import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import "./ClassroomPostView.css";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { Avatar } from "@material-ui/core";
import moment from "moment";
import { db } from "../../firebase";
import VideoCard from "../VideoCard";
import CommentView from "../CommentView";
import Header from "../Header";

function ClassroomPostView({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }

  const [userData, setUserData] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  var [likes, setLikes] = useState(0);
  const [timestamp, setTimestamp] = useState();
  const [postedBy, setPostedBy] = useState("");
  const [type, setType] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (isMounted) {
      db.collection("class_posts")
        .doc(id)
        .get()
        .then((doc) => {
          setUserData(doc.data().userData);
          setMessage(doc.data().description);
          setImage(doc.data().resources);
          setLikes(doc.data().likes);
          setTimestamp(doc.data().postedOn);
          setType(doc.data().type);
          setLink(doc.data().link);
          db.collection("class_rooms")
            .doc(doc.data().class)
            .get()
            .then((doc) => {
              if (doc.data().students.includes(user.uid)) {
                setIsStudent(true);
              } else {
                history.push("/classroom");
              }
            });
        });
      if (likes && likes[user.uid]) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
    return () => setIsMounted(false);
  }, [id, isLiked, user.uid, likes, isMounted, history, isStudent]);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");

  const noLikes = likes
    ? Object.values(likes)?.reduce((a, v) => (v === true ? a + 1 : a), 0)
    : 0;

  userData &&
    userData.get().then((doc) => {
      setProfilePic(doc.data().photoUrl);
      setUsername(doc.data().name);
      setPostedBy(doc.id);
    });

  const toogleLikes = (e) => {
    if (likes) {
      likes[user.uid] = !isLiked;
      db.collection("class_posts").doc(id).update({
        likes: likes,
      });
    } else {
      likes = {};
      likes[user.uid] = !isLiked;
      db.collection("class_posts").doc(id).update({
        likes: likes,
      });
    }
    setIsLiked(!isLiked);
  };

  return (
    <>
      <div className="postView">
        <Header user={user} />
        <div className="postView__body">
          <div className="postView__left">
            <div className="postView__top">
              <Link to={"/users/" + postedBy} className="profile__link">
                <Avatar src={profilePic} className="postView__avatar" />
                <div className="postView__topInfo">
                  <h3>{username}</h3>
                  <p>{moment(timestamp?.toDate()).calendar()}</p>
                </div>
              </Link>
            </div>
            {message ? (
              <div className="postView__bottom">
                <p> {message} </p>
                {link && (
                  <div className="post__link">
                    <span>Link: </span>
                    <a href={link} target="__blank">
                      {link}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {image ? (
              type ? (
                <div className="postView__image">
                  <VideoCard src={image} />
                </div>
              ) : (
                <div className="postView__image">
                  <img src={image} alt="" />
                </div>
              )
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
              </div>

              <div className="postView__option postShare__option">
                <p></p>
              </div>
            </div>
          </div>
          <div className="postView__right">
            <CommentView postId={id} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ClassroomPostView;
