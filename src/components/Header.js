import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import StorefrontIcon from "@material-ui/icons/Storefront";
import TextsmsIcon from "@material-ui/icons/Textsms";
import { Avatar } from "@material-ui/core";
import logoSmall from "../assets/logo_small.png";
import InfiniteScroll from "react-infinite-scroll-component";
function Header({ user, isActive }) {
  const history = useHistory("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(10);
  const [results, setResults] = useState([]);
  useEffect(() => {
    db.collection("users")
      .where("keys", "array-contains", search.toLowerCase().split(" ").join(""))
      .limit(page)
      .onSnapshot((snapshot) =>
        setResults(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [page, search]);
  const fetchMore = (e) => {
    setPage(page + 1);
  };

  const logout = (event) => {
    event.preventDefault();
    auth.signOut();
    localStorage.clear();
    history.push("/login");
  };
  const hideSearch = () => {
    document.getElementById("header_search").style.display = "block";
  };
  const showSearch = () => {
    setTimeout(() => {
      document.getElementById("header_search").style.display = "none";
    }, 190);
  };
  return (
    <div className="header">
      <div className="header__left">
        <Link to="/" className="header__link">
          <img src={logo} className="header__logo" id="header__logo" alt="" />
          <img
            src={logoSmall}
            className="header__logo"
            id="header__logoSmall"
            alt=""
          />
        </Link>
        <div className="header__searchField">
          <div className="header__input">
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Friends"
              onFocus={hideSearch}
              onBlur={showSearch}
            />
          </div>
          <div className="header__searchResults" id="header_search">
            <InfiniteScroll
              dataLength={results.length} //This is important field to render the next data
              next={fetchMore}
              hasMore={true}
            >
              {results.map((result) => (
                <Link
                  to={"/users/" + result.id}
                  className="header__searchLink"
                  key={result.id}
                >
                  <div className="header__user">
                    <Avatar src={result.data.photoUrl} />
                    <h4> {result.data.name} </h4>
                  </div>
                </Link>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <div className="header__center">
        <Link to="/">
          <div
            className={`header__option ${
              isActive === "home" && "header__option--active"
            }`}
          >
            <HomeIcon fontSize="large" className="header__optionIcon" />
          </div>
        </Link>
        <div className="header__option">
          <NotificationsIcon fontSize="large" className="header__optionIcon" />
        </div>
        <div
          className={`header__option ${
            isActive === "messages" && "header__option--active"
          }`}
        >
          <TextsmsIcon fontSize="large" className="header__optionIcon" />
        </div>
        <div className="header__option">
          <StorefrontIcon fontSize="large" className="header__optionIcon" />
        </div>
      </div>

      <div className="header__right">
        <Link to={"/users/" + user.uid}>
          <div className="header__info">
            <Avatar src={user.photoURL} alt="" />
            <h4>{user.displayName}</h4>
          </div>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;
