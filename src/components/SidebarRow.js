import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarRow.css";

function SidebarRow({ src, Icon, title }) {
  return (
    <div className="sidebarRow">
      {src && <Avatar src={src} className="sidebarRow__icon" />}
      {Icon && <Icon className="sidebarRow__icon" />}
      <h4> {title} </h4>
    </div>
  );
}

export default SidebarRow;
