import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Group.css";
import GroupFeed from "./GroupFeed";

function Group({ user, props }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="groups">
      <Header user={user} />
      <div className="groups__body">
        <Sidebar user={user} isActive="groups" />
        <GroupFeed user={user} location={"/groups"} />
      </div>
    </div>
  );
}

export default Group;
