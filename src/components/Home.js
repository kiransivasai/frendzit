import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Feed from "./Feed";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Home.css";
import UserCard from "./UserCard";
import { db } from "../firebase";

function Home({ user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          setFriends(doc.data().friends);
        });
    }
  }, [user]);
  const friendsList = [1, user.uid];
  for (var frn in friends) {
    if (friends[frn] === 3) {
      friendsList.push(frn);
    }
  }

  return (
    <div className="home">
      <Header user={user} isActive="home" />
      <div className="home__body">
        <Sidebar user={user} />
        <Feed user={user} friends={friends} friendsList={friendsList} />
        <UserCard user={user} />
      </div>
    </div>
  );
}

export default Home;
