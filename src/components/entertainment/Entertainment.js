import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Entertainment.css";
import EntFeed from "./EntFeed";

function Entertainment({ user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }

  return (
    <div className="entertainment">
      <Header user={user} />
      <div className="entertainment__body">
        <Sidebar user={user} isActive={"entertainment"} />
        <EntFeed user={user} />
      </div>
    </div>
  );
}

export default Entertainment;
