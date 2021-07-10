import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import PagePost from "./PagePost";
import moment from "moment";
import "./PagePostsFeed.css";

function PagePostsFeed({ user, id }) {
  const [pgPosts, setGrpPosts] = useState([]);
  useEffect(() => {
    db.collection("page_posts")
      .where("page", "==", id)
      .orderBy("postedOn", "desc")
      .onSnapshot((snapshot) => {
        setGrpPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [id]);
  return (
    <div className="pagePostsFeed">
      {pgPosts.map((post) => (
        <PagePost
          message={post.data.description}
          timestamp={moment(post.data.postedOn?.toDate()).calendar()}
          userData={post.data.userData}
          image={post.data.resources}
          likes={post.data.likes}
          userUid={user.uid}
          postId={post.id}
          page={post.data.page}
          type={post.data.type}
          key={post.id}
        />
      ))}
    </div>
  );
}

export default PagePostsFeed;
