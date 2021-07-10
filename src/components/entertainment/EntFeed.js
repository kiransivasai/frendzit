import React, { useEffect, useState } from "react";
import "./EntFeed.css";
import EntUploader from "./EntUploader";
import InfiniteScroll from "react-infinite-scroll-component";
import EntPost from "./EntPost";
import { db } from "../../firebase";
import moment from "moment";
import { Button } from "@material-ui/core";

function EntFeed({ user }) {
  const [page, setPage] = useState(10);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [type, setType] = useState(10);

  useEffect(() => {
    if (user) {
      if (type === 10) {
        db.collection("entertainment")
          .orderBy("postedOn", "desc")
          .limit(page)
          .onSnapshot((snapshot) =>
            setPosts(
              snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
            )
          );
      } else {
        db.collection("entertainment")
          .where("type", "==", type)
          .orderBy("postedOn", "desc")
          .limit(page)
          .onSnapshot((snapshot) =>
            setPosts(
              snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
            )
          );
      }
    }
  }, [page, user, type]);
  const fetchMore = (e) => {
    setPage(page + 5);
    if (page > posts.length) {
      setHasMore(false);
    }
  };
  return (
    <div className="entFeed">
      <EntUploader src={user.photoURL} user={user} />
      <div className="entFeed__type">
        <Button
          className={`entFeed__button ${type === 10 && "entFeedActive"}`}
          onClick={(e) => setType(10)}
        >
          All
        </Button>
        <Button
          className={`entFeed__button ${type === 1 && "entFeedActive"}`}
          onClick={(e) => setType(1)}
        >
          Audio
        </Button>
        <Button
          className={`entFeed__button ${type === 0 && "entFeedActive"}`}
          onClick={(e) => setType(0)}
        >
          Video
        </Button>
      </div>

      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        className="feed__div"
      >
        <div className="entFeed__posts">
          {posts.map((post) => (
            <EntPost
              timestamp={moment(post.data.postedOn?.toDate()).calendar()}
              image={post.data.resource}
              likes={post.data.likes}
              userUid={user.uid}
              postId={post.id}
              type={post.data.type}
              key={post.id}
              postedBy={post.data.postedBy}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default EntFeed;
