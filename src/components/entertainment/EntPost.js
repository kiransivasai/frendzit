import { Backdrop, ClickAwayListener, Fade, Modal } from "@material-ui/core";
import React, { useState } from "react";
import "./EntPost.css";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import { db } from "../../firebase";
import Likes from "../likes/Likes";
import EntVideoCard from "./EntVideoCard";
import EntAudioCard from "./EntAudioCard";

function EntPost({ image, timestamp, likes, userUid, postId, type, postedBy }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const noLikes = likes
    ? Object.values(likes)?.reduce((a, v) => (v === true ? a + 1 : a), 0)
    : 0;

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
      db.collection("entertainment").doc(postId).update({
        likes: likes,
      });
    } else {
      likes = {};
      likes[userUid] = !isLiked;
      db.collection("entertainment").doc(postId).update({
        likes: likes,
      });
    }
    setIsLiked(!isLiked);
  };
  const deleteEntPost = () => {
    db.collection("entertainment").doc(postId).delete();
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
      <div className="entPost">
        <div className="entPost__top">
          <div className="entPost__topRight">
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
                    <div className="entPost__topRightOptions">
                      <h5 onClick={() => deleteEntPost()}>Delete</h5>
                    </div>
                  </ClickAwayListener>
                )}
              </>
            )}
          </div>
        </div>

        {image ? (
          type ? (
            <div className="entPost__audio">
              <EntAudioCard key={postId} src={image} />
            </div>
          ) : (
            <div className="entPost__image">
              <EntVideoCard key={postId} src={image} />
            </div>
          )
        ) : (
          <></>
        )}

        <div className="entPost__options">
          <div className="entPost__option postLike__option">
            <div onClick={toogleLikes}>
              {isLiked ? (
                <FavoriteIcon className="liked__button" />
              ) : (
                <FavoriteBorderIcon className="entPostLike__button" />
              )}
            </div>
            <p onClick={(e) => setModalOpen(true)}> {noLikes ? noLikes : 0}</p>
          </div>
          <div className="entPost__option postShare__option">
            <ShareIcon className="entPostShare__button" />
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EntPost;
