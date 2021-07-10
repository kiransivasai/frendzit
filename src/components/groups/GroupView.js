import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import GroupPostsFeed from "./GroupPostsFeed";
import GroupPostUploader from "./GroupPostUploader";
import GroupTopCard from "./GroupTopCard";
import "./GroupView.css";

function GroupView({ user, id }) {
  const [groupMembers, setGroupMembers] = useState([]);
  useEffect(() => {
    db.collection("groups")
      .doc(id)
      .onSnapshot((doc) => {
        setGroupMembers(doc.data().members);
      });
  }, [id]);
  return (
    <div className="groupView">
      <GroupTopCard user={user} id={id} />
      {groupMembers.includes(user.uid) && (
        <GroupPostUploader user={user} id={id} />
      )}
      <GroupPostsFeed user={user} id={id} />
    </div>
  );
}

export default GroupView;
