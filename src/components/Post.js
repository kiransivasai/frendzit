import {
  Avatar,
  Backdrop,
  ClickAwayListener,
  Fade,
  Modal,
} from "@material-ui/core";
import React, { useState } from "react";
import "./Post.css";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Likes from "./likes/Likes";
import ClearIcon from "@material-ui/icons/Clear";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

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
  const [modalOpen, setModalOpen] = useState(false);

  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = "https://frendzit-a0ec6.web.app/post/" + postId;

  const noLikes = likes
    ? Object.values(likes)?.reduce((a, v) => (v === true ? a + 1 : a), 0)
    : 0;

  userData
    ? userData.get().then((doc) => {
        setProfilePic(doc.data().photoUrl);
        setUsername(doc.data().name);
        setPostedBy(doc.id);
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
  const deletePost = () => {
    db.collection("posts").doc(postId).delete();
    setOpen(false);
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
                <h4>Likes</h4>
              </div>
              <div
                className="modalBox__right"
                onClick={(e) => setModalOpen(false)}
              >
                <ClearIcon className="clearIcon" />
              </div>
            </div>
            <Likes id={postId} likes={likes} />
          </div>
        </Fade>
      </Modal>
      <div className="post">
        <div className="post__top">
          <div className="post__topLeft">
            <Link to={"/users/" + postedBy} className="profile__link">
              <Avatar src={profilePic} className="post__avatar" />
              <div className="post__topInfo">
                <h3>{username}</h3>
                <p>{timestamp}</p>
              </div>
            </Link>
          </div>
          <div className="post__topRight">
            {postedBy === userUid && (
              <>
                <MoreVertIcon
                  onClick={() => setOpen(!open)}
                  className="more__icon"
                />
                {open && (
                  <ClickAwayListener
                    key={postId}
                    onClickAway={(e) => setOpen(false)}
                  >
                    <div className="post__topRightOptions">
                      <h5 onClick={() => deletePost()}>Delete</h5>
                    </div>
                  </ClickAwayListener>
                )}
              </>
            )}
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
            <div className="post__image">
              <VideoCard key={postId} src={image} />
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
          <div className="post__option postLike__option">
            <div onClick={toogleLikes}>
              {isLiked ? (
                <FavoriteIcon className="liked__button" />
              ) : (
                <FavoriteBorderIcon className="postLike__button" />
              )}
            </div>
            <p onClick={(e) => setModalOpen(true)}> {noLikes ? noLikes : 0}</p>
          </div>
          <Link to={"/post/" + postId} className="postComment__link">
            <div className="post__option postComment__option">
              <CommentIcon className="postComment__button" />
            </div>
          </Link>
          <div className="post__option postShare__option">
            <ShareIcon
              className="postShare__button"
              onClick={(e) => setShareOpen(!shareOpen)}
            />
            {shareOpen && (
              <ClickAwayListener onClickAway={(e) => setShareOpen(false)}>
                <div className="postShare__content">
                  <WhatsappShareButton
                    url={shareUrl}
                    className="postContent__button"
                    children={
                      <p className="shareButton">
                        <WhatsappIcon size={25} round={true} />
                        &nbsp; Share to WhatsApp
                      </p>
                    }
                  />
                  <TwitterShareButton
                    url={shareUrl}
                    className="postContent__button"
                    children={
                      <p className="shareButton">
                        <TwitterIcon size={25} round={true} />
                        &nbsp; Share to Twitter
                      </p>
                    }
                  />
                  <FacebookShareButton
                    url={shareUrl}
                    className="postContent__button"
                    children={
                      <p className="shareButton">
                        <FacebookIcon size={25} round={true} />
                        &nbsp; Share to Facebook
                      </p>
                    }
                  />
                </div>
              </ClickAwayListener>
            )}
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
