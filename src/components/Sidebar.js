import React from "react";
import "./Sidebar.css";
import SidebarRow from "./SidebarRow";
import PeopleIcon from "@material-ui/icons/People";
import EmojiFlagsIcon from "@material-ui/icons/EmojiFlags";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import StorefrontIcon from "@material-ui/icons/Storefront";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ChatIcon from "@material-ui/icons/Chat";

function Sidebar({ user }) {
  return (
    <div className="sidebar">
      <div className="sidebar__body">
        <SidebarRow src={user.photoURL} title={user.displayName} />
        <SidebarRow Icon={EmojiFlagsIcon} title="Groups" />
        <SidebarRow Icon={MenuBookIcon} title="Pages" />
        <SidebarRow Icon={PeopleIcon} title="Friends" />
        <SidebarRow Icon={NotificationsIcon} title="Notifications" />
        <SidebarRow Icon={StorefrontIcon} title="Store" />
        <SidebarRow Icon={ChatIcon} title="Messages" />
      </div>
    </div>
  );
}

export default Sidebar;
