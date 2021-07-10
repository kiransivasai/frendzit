import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./ClassroomInfo.css";
import ClassroomView from "./ClassroomView";

function ClassroomInfo({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  return (
    <div className="classroomInfo">
      <Header user={user} />
      <div className="classroomInfo__body">
        <Sidebar user={user} isActive="classrooms" />
        <ClassroomView user={user} id={id} />
      </div>
    </div>
  );
}

export default ClassroomInfo;
