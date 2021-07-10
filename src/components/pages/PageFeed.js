import { Avatar, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import CreatePage from "./CreatePage";
import moment from "moment";
import "./PageFeed.css";
import PagePost from "./PagePost";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SearchIcon from "@material-ui/icons/Search";

function PageFeed({ location, user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }

  const [pages, setPages] = useState([]);
  const [pagePosts, setPagePosts] = useState([]);
  const [pgIds, setGrpIds] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    db.collection("pages")
      .where("keys", "array-contains", search.toLowerCase().split(" ").join(""))
      .onSnapshot((snapshot) =>
        setResults(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [search]);

  useEffect(() => {
    if (user) {
      db.collection("pages")
        .where("followers", "array-contains", user.uid)
        .onSnapshot((snapshot) => {
          setPages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
          setGrpIds(snapshot.docs.map((doc) => doc.id));
        });
    }
  }, [user]);
  useEffect(() => {
    if (pgIds.length > 0) {
      db.collection("page_posts")
        .orderBy("postedOn", "desc")
        .onSnapshot((snapshot) => {
          setPagePosts(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  }, [pgIds]);
  const rightScroll = (e) => {
    document.getElementById("pages__cont").scrollLeft += 100;
  };
  const leftScroll = (e) => {
    document.getElementById("pages__cont").scrollLeft -= 100;
  };
  const hideSearch = () => {
    if (document.getElementById("page_search")) {
      document.getElementById("page_search").style.display = "block";
    }
  };
  const showSearch = () => {
    setTimeout(() => {
      if (document.getElementById("page_search")) {
        document.getElementById("page_search").style.display = "none";
      }
    }, 220);
  };

  return (
    <div className="pageFeed">
      <div className="pageFeed__top">
        <div className="pageFeed__info">
          <h3>Pages</h3>
          <div className="page__searchField">
            <div className="page__input">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Pages"
                onFocus={hideSearch}
                onBlur={showSearch}
              />
            </div>
            <div className="page__searchResults" id="page_search">
              {results.map((result) => (
                <Link
                  to={"/page/" + result.id}
                  className="page__searchLink"
                  key={result.id}
                >
                  <div className="page__user">
                    <Avatar src={result.data.pic} />
                    <h4> {result.data.name} </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Link className="pageCreate" to={`${location}/create`}>
            Create page
          </Link>
        </div>
        <div className="pageFeed__center">
          <div className="leftScroll" onClick={(e) => leftScroll(e)}>
            <KeyboardArrowLeftIcon />
          </div>
          <div className="pgs" id="pages__cont">
            {pages.map((page) => (
              <Link key={page.id} to={"/page/" + page.id}>
                <div className="pg">
                  <Tooltip title={page.data.name} arrow>
                    <Avatar src={page.data.pic} className="pg__avatar" />
                  </Tooltip>
                </div>
              </Link>
            ))}
          </div>
          <div className="rightScroll" onClick={(e) => rightScroll(e)}>
            <KeyboardArrowRightIcon />
          </div>
        </div>
      </div>

      <div className="pg__posts">
        {pagePosts.map((post) => {
          if (pgIds.includes(post.data.page)) {
            return (
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
            );
          }
          return "";
        })}
      </div>

      <Route
        path={`${location}/create`}
        render={() => {
          return <CreatePage user={user} />;
        }}
      />
    </div>
  );
}

export default PageFeed;
