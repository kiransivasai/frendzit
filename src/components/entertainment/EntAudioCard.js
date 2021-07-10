import React, { useEffect, useRef, useState } from "react";
import "./EntAudioCard.css";
import logo from "../../assets/audio-file.jpg";
import { ClickAwayListener } from "@material-ui/core";

function EntAudioCard({ src }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const onVideoPress = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };
  const handleScroll = () => {
    var temp = document.getElementById(src);
    if (temp) {
      var rect = temp.getBoundingClientRect();
      var elementTop = rect.top;
      var elementBottom = rect.bottom;
      var isVisible = elementTop < window.innerHeight && elementBottom >= 200;

      if (!isVisible && isVideoPlaying && videoRef.current) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });
  const pauseVideo = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={pauseVideo}>
      <div
        className="entAudioCard"
        id={src}
        style={{ backgroundImage: `url(${logo})` }}
        onClick={onVideoPress}
      >
        <video
          ref={videoRef}
          onClick={onVideoPress}
          className="entAudioCard__player"
          src={src}
          alt="Video"
          loop
        />
        {isVideoPlaying ? (
          <></>
        ) : (
          <div onClick={onVideoPress} className="audioPlayButton"></div>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default EntAudioCard;
