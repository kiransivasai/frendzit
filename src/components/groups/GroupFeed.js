import { Avatar, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, Route, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import CreateGroup from "./CreateGroup";
import moment from "moment";
import "./GroupFeed.css";
import GroupPost from "./GroupPost";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SearchIcon from "@material-ui/icons/Search";

function GroupFeed({ location, user }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [groups, setGroups] = useState([]);
  const [groupPosts, setGroupPosts] = useState([]);
  const [grpIds, setGrpIds] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    db.collection("groups")
      .where("keys", "array-contains", search.toLowerCase())
      .onSnapshot((snapshot) =>
        setResults(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [search]);

  useEffect(() => {
    if (user) {
      db.collection("groups")
        .where("members", "array-contains", user.uid)
        .onSnapshot((snapshot) => {
          setGroups(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
          setGrpIds(snapshot.docs.map((doc) => doc.id));
        });
    }
  }, [user]);
  useEffect(() => {
    if (grpIds.length > 0) {
      db.collection("group_posts")
        .orderBy("postedOn", "desc")
        .onSnapshot((snapshot) => {
          setGroupPosts(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );
        });
    }
  }, [grpIds]);
  const rightScroll = (e) => {
    document.getElementById("groups__cont").scrollLeft += 100;
  };
  const leftScroll = (e) => {
    document.getElementById("groups__cont").scrollLeft -= 100;
  };
  const hideSearch = () => {
    if (document.getElementById("group_search")) {
      document.getElementById("group_search").style.display = "block";
    }
  };
  const showSearch = () => {
    setTimeout(() => {
      if (document.getElementById("group_search")) {
        document.getElementById("group_search").style.display = "none";
      }
    }, 220);
  };

  return (
    <div className="groupFeed">
      <div className="groupFeed__top">
        <div className="groupFeed__info">
          <h3>Groups</h3>
          <div className="group__searchField">
            <div className="group__input">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Groups"
                onFocus={hideSearch}
                onBlur={showSearch}
              />
            </div>
            <div className="group__searchResults" id="group_search">
              {results.map((result) => (
                <Link
                  to={"/group/" + result.id}
                  className="group__searchLink"
                  key={result.id}
                >
                  <div className="group__user">
                    <Avatar src={result.data.pic} />
                    <h4> {result.data.name} </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Link className="groupCreate" to={`${location}/create`}>
            Create
          </Link>
        </div>
        <div className="groupFeed__center">
          <div className="leftScroll" onClick={(e) => leftScroll(e)}>
            <KeyboardArrowLeftIcon />
          </div>
          <div className="grps" id="groups__cont">
            {groups.map((group) => (
              <Link key={group.id} to={"/group/" + group.id}>
                <div className="grp">
                  <Tooltip title={group.data.name} arrow>
                    <Avatar src={group.data.pic} className="grp__avatar" />
                  </Tooltip>
                </div>
              </Link>
            ))}
          </div>
          <div className="rightScroll" onClick={(e) => rightScroll(e)}>
            <KeyboardArrowRightIcon />
          </div>
          {/* <div className="grpView">
            <span className="viewAll">ViewAll</span>
          </div> */}
        </div>
      </div>

      <div className="grp__posts">
        {groupPosts.map((post) => {
          if (grpIds.includes(post.data.group)) {
            return (
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
            );
          }
          return "";
        })}
      </div>

      <Route
        path={`${location}/create`}
        render={() => {
          return <CreateGroup user={user} />;
        }}
      />
    </div>
  );
}

export default GroupFeed;
