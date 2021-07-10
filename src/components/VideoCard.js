import React, { useEffect, useRef, useState } from "react";
import "./VideoCard.css";

function VideoCard({ src }) {
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

  return (
    <div className="videoCard" id={src}>
      <video
        ref={videoRef}
        onClick={onVideoPress}
        className="videoCard__player"
        src={src}
        alt="Video"
        loop
      />
      {isVideoPlaying ? (
        <></>
      ) : (
        <div onClick={onVideoPress} className="playButton"></div>
      )}
    </div>
  );
}

export default VideoCard;
