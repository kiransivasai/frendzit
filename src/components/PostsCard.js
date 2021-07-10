import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import "./PostCard.css";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

function PostsCard({ user, id }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      db.collection("posts")
        .where("postedBy", "==", id)
        .orderBy("postedOn", "desc")
        .limit(page)
        .onSnapshot((snapshot) =>
          setPosts(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          )
        );
    }
    return () => (isMounted = false);
  }, [id, page]);
  const fetchMore = (e) => {
    setPage(page + 5);
    if (page > posts.length) {
      setHasMore(false);
    }
  };
  return (
    <div className="postCard">
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        className="postCard__div"
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

export default PostsCard;
