import React, { useState } from "react";
import ShareIcon from "@material-ui/icons/Share";
import { Button, ClickAwayListener } from "@material-ui/core";
import "./ClassCard.css";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

function ClassCard({
  user,
  classId,
  color,
  createdBy,
  createdOn,
  description,
  name,
  students,
  docId,
}) {
  const colors = [
    "#168400",
    "#1a0363",
    "#0d8491",
    "#890c1b",
    "#310891",
    "#b25c00",
    "#930301",
  ];
  color = colors[color];
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = "https://www.frendzit.in/classroom";
  return (
    <div className="classCard">
      <Link to={"/class/" + docId} className="classCard__link">
        <div className="classCard__top" style={{ backgroundColor: color }}>
          <h3>{name}</h3>
        </div>
      </Link>
      <div className="classCard__center">
        <h4> {description} </h4>
      </div>
      <div className="classCard__bottom">
        <Link to={"/class/" + docId} className="classCard__link">
          <Button
            className="classCard__explore"
            style={{ backgroundColor: color }}
          >
            Explore
          </Button>
        </Link>
        <ShareIcon
          className="shareIcon"
          onClick={(e) => setShareOpen(!shareOpen)}
        />
        {shareOpen && (
          <ClickAwayListener onClickAway={(e) => setShareOpen(false)}>
            <div className="postShare__content">
              <WhatsappShareButton
                url={
                  "You are invited to join the classroom using code : " +
                  classId +
                  " on Friendzit."
                }
                className="postContent__button"
                children={
                  <p className="shareButton">
                    <WhatsappIcon size={25} round={true} />
                    &nbsp; Share to WhatsApp
                  </p>
                }
              />
              <TwitterShareButton
                url={
                  "You are invited to join the classroom using code : " +
                  classId +
                  " on Friendzit."
                }
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
                quote={
                  "You are invited to join the classroom using code : " +
                  classId +
                  " on Friendzit."
                }
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
      </div>
    </div>
  );
}

export default ClassCard;
