import React from "react";
import Header from "./components/Header";
import ProfileCard from "./components/ProfileCard";
import PostsCard from "./components/PostsCard";
import "./UserProfile.css";
import Sidebar from "./components/Sidebar";

function UserProfile({ user, id }) {
  return (
    <div className="userProfile">
      <Header key={id} user={user} />
      <div className="userProfile__body">
        {user.uid === id ? (
          <Sidebar user={user} isActive={"profile"} />
        ) : (
          <Sidebar user={user} />
        )}
        <div className="userProfile__info">
          <ProfileCard user={user} id={id} />
          <PostsCard key={id} user={user} id={id} />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
