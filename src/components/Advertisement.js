import { Avatar } from "@material-ui/core";
import React from "react";
import "./Advertisement.css";

function Advertisement({ title, image, desc }) {
  return (
    <div className="advertisement">
      <div className="advertisement__top">
        <Avatar />
        <div className="adTop__info">
          <h3>{title}</h3>
          <p>Sponsered</p>
        </div>
      </div>
      <div className="advertisement__center">
        <img src={image} alt="ad" />
      </div>
      <div className="advertisement__bottom">
        <p>{desc}</p>
        <button>Shop now</button>
      </div>
    </div>
  );
}

export default Advertisement;
