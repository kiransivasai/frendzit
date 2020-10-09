import React from "react";
import { useHistory } from "react-router-dom";
import Feed from "./Feed";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Home.css";
import UserCard from "./UserCard";

function Home({ user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }

  return (
    <div className="home">
      <Header user={user} isActive="home" />
      <div className="home__body">
        <Sidebar user={user} />
        <Feed user={user} />
        <UserCard user={user} />
      </div>
    </div>
  );
}

export default Home;
