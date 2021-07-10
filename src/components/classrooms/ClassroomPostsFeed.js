import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import ClassroomPost from "./ClassroomPost";
import moment from "moment";
import "./ClassroomPostsFeed.css";

function ClassroomPostsFeed({ user, id }) {
  const [clsPosts, setClsPosts] = useState([]);
  useEffect(() => {
    db.collection("class_posts")
      .where("class", "==", id)
      .orderBy("postedOn", "desc")
      .onSnapshot((snapshot) => {
        setClsPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [id]);
  return (
    <div className="classroomPostsFeed">
      {clsPosts.map((post) => (
        <ClassroomPost
          message={post.data.description}
          timestamp={moment(post.data.postedOn?.toDate()).calendar()}
          userData={post.data.userData}
          image={post.data.resources}
          likes={post.data.likes}
          userUid={user.uid}
          postId={post.id}
          classroom={post.data.class}
          type={post.data.type}
          link={post.data.link}
          key={post.id}
        />
      ))}
    </div>
  );
}

export default ClassroomPostsFeed;
