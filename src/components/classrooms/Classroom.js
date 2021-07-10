import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Classroom.css";
import ClassroomFeed from "./ClassroomFeed";

function Classroom({ user, props }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="classroom">
      <Header user={user} />
      <div className="classroom__body">
        <Sidebar user={user} isActive="classroom" />
        <ClassroomFeed user={user} location={"/classroom"} />
      </div>
    </div>
  );
}

export default Classroom;
