import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Page.css";
import PageFeed from "./PageFeed";

function Page({ user, props }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="pages">
      <Header user={user} />
      <div className="pages__body">
        <Sidebar user={user} isActive="pages" />
        <PageFeed user={user} location={"/pages"} />
      </div>
    </div>
  );
}

export default Page;
