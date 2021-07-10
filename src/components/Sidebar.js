import React from "react";
import "./Sidebar.css";
import SidebarRow from "./SidebarRow";
import PeopleIcon from "@material-ui/icons/People";
import EmojiFlagsIcon from "@material-ui/icons/EmojiFlags";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import StoreIcon from "@material-ui/icons/Store";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ChatIcon from "@material-ui/icons/Chat";
import { Link } from "react-router-dom";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";

function Sidebar({ user, isActive }) {
  return (
    <div className="sidebar">
      <div className="sidebar__body">
        <Link to={"/users/" + user.uid} className="sidebarLink">
          <SidebarRow
            src={user.photoURL}
            isActive={isActive === "profile" && "active"}
            title={user.displayName}
          />
        </Link>
        <Link to="/friends" className="sidebarLink">
          <SidebarRow
            Icon={PeopleIcon}
            isActive={isActive === "friends" && "active"}
            title="Friends"
          />
        </Link>
        <Link to="/store" className="sidebarLink">
          <SidebarRow
            isActive={isActive === "store" && "active"}
            Icon={StoreIcon}
            title="Store"
          />
        </Link>
        <Link to="/classroom" className="sidebarLink">
          <SidebarRow
            Icon={ImportContactsIcon}
            isActive={isActive === "classroom" && "active"}
            title="Classroom"
          />
        </Link>

        <Link to="/entertainment" className="sidebarLink">
          <SidebarRow
            Icon={WhatshotIcon}
            isActive={isActive === "entertainment" && "active"}
            title="Entertainment"
          />
        </Link>
        <Link to="/groups" className="sidebarLink">
          <SidebarRow
            Icon={EmojiFlagsIcon}
            isActive={isActive === "groups" && "active"}
            title="Groups"
          />
        </Link>
        <Link to="/pages" className="sidebarLink">
          <SidebarRow
            Icon={TableChartOutlinedIcon}
            title="Pages"
            isActive={isActive === "pages" && "active"}
          />
        </Link>
        <Link to="/notifications" className="sidebarLink">
          <SidebarRow
            Icon={NotificationsIcon}
            title="Notifications"
            isActive={isActive === "notifications" && "active"}
          />
        </Link>

        <Link to="/messages" className="sidebarLink">
          <SidebarRow Icon={ChatIcon} title="Messages" />
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
