import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./GroupInfo.css";
import GroupView from "./GroupView";

function GroupInfo({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="groupInfo">
      <Header user={user} />
      <div className="groupInfo__body">
        <Sidebar user={user} isActive="groups" />
        <GroupView user={user} id={id} />
      </div>
    </div>
  );
}

export default GroupInfo;
