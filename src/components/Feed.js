import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./Feed.css";
import Post from "./Post";
import PostUploader from "./PostUploader";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

function Feed({ user, friends, friendsList }) {
  const [page, setPage] = useState(10);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (isMounted) {
      var frn_list = [1, user.uid];
      for (var frn in friends) {
        if (friends[frn] === 3) {
          frn_list.push(frn);
        }
      }
      if (user && friendsList) {
        db.collection("posts")
          .orderBy("postedOn", "desc")
          .onSnapshot((snapshot) =>
            setPosts(
              snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
            )
          );
      }
    }
    return () => setIsMounted(false);
  }, [page, friends, friendsList, user, isMounted]);

  const fetchMore = (e) => {
    setPage(page + 5);
    if (page > posts.length) {
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
        className="feed__div"
      >
        <div className="feed__posts">
          {posts.map((post) => {
            var length = 0;
            if (length !== page) {
              if (friendsList.includes(post.data.postedBy)) {
                return (
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
                );
              }
              length = length + 1;
            }
            return "";
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Feed;
