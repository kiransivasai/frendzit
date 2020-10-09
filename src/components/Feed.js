import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./Feed.css";
import Post from "./Post";
import PostUploader from "./PostUploader";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

function Feed({ user }) {
  const [page, setPage] = useState(2);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    db.collection("posts")
      .orderBy("postedOn", "desc")
      .limit(page)
      .onSnapshot((snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  }, [page]);
  const fetchMore = (e) => {
    setPage(page + 1);
    if (page > posts.length) {
      console.log(false);
      setHasMore(false);
    }
  };
  return (
    <div className="feed">
      <PostUploader src={user.photoURL} user={user} />

      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
      >
        {posts.map((post) => (
          <Post
            message={post.data.description}
            timestamp={moment(post.data.postedOn?.toDate()).calendar()}
            userData={post.data.userData}
            image={post.data.resources}
            likes={post.data.likes}
            userUid={user.uid}
            postId={post.id}
            type={post.data.type}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default Feed;
