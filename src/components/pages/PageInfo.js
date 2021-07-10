import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./PageInfo.css";
import PageView from "./PageView";

function PageInfo({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="pageInfo">
      <Header user={user} />
      <div className="pageInfo__body">
        <Sidebar user={user} isActive="pages" />
        <PageView user={user} id={id} />
      </div>
    </div>
  );
}

export default PageInfo;
