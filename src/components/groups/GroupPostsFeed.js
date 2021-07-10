import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import GroupPost from "./GroupPost";
import moment from "moment";
import "./GroupPostsFeed.css";

function GroupPostsFeed({ user, id }) {
  const [grpPosts, setGrpPosts] = useState([]);
  useEffect(() => {
    db.collection("group_posts")
      .where("group", "==", id)
      .orderBy("postedOn", "desc")
      .onSnapshot((snapshot) => {
        setGrpPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [id]);
  return (
    <div className="groupPostsFeed">
      {grpPosts.map((post) => (
        <GroupPost
          message={post.data.description}
          timestamp={moment(post.data.postedOn?.toDate()).calendar()}
          userData={post.data.userData}
          image={post.data.resources}
          likes={post.data.likes}
          userUid={user.uid}
          postId={post.id}
          group={post.data.group}
          type={post.data.type}
          key={post.id}
        />
      ))}
    </div>
  );
}

export default GroupPostsFeed;
