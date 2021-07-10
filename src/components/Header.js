import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import StoreIcon from "@material-ui/icons/Store";
import TextsmsIcon from "@material-ui/icons/Textsms";
import { Avatar, Button } from "@material-ui/core";
import logoSmall from "../assets/logo_small.png";
import InfiniteScroll from "react-infinite-scroll-component";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import SidebarRow from "./SidebarRow";

import WhatshotIcon from "@material-ui/icons/Whatshot";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import PeopleIcon from "@material-ui/icons/People";
import EmojiFlagsIcon from "@material-ui/icons/EmojiFlags";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import ChatIcon from "@material-ui/icons/Chat";

function Header({ user, isActive }) {
  const history = useHistory("");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [page, setPage] = useState(10);
  const [results, setResults] = useState([]);
  useEffect(() => {
    db.collection("users")
      .where("keys", "array-contains", search.toLowerCase())
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
    }, 220);
  };
  return (
    <div className="header">
      <div className="header__left">
        <MenuIcon
          className="menu__icon"
          onClick={(e) => setMenuOpen(!menuOpen)}
        />
        {menuOpen && (
          <div className="header__menu">
            <div className="header__cancel">
              <CancelIcon
                className="cancelIcon"
                onClick={(e) => setMenuOpen(false)}
              />
            </div>
            <div className="header__menuBar">
              <Link to={"/users/" + user.uid} className="sidebarLink">
                <SidebarRow
                  src={user.photoURL}
                  isActive={isActive === "profile" && "active"}
                  title={user.displayName}
                />
              </Link>
              <Link to="/friends" className="sidebarLink">
                <SidebarRow
                  Icon={PeopleIcon}
                  isActive={isActive === "friends" && "active"}
                  title="Friends"
                />
              </Link>
              <SidebarRow Icon={StoreIcon} title="Store" />
              <Link to="/classroom" className="sidebarLink">
                <SidebarRow
                  Icon={ImportContactsIcon}
                  isActive={isActive === "classroom" && "active"}
                  title="Classroom"
                />
              </Link>

              <Link to="/entertainment" className="sidebarLink">
                <SidebarRow
                  Icon={WhatshotIcon}
                  isActive={isActive === "entertainment" && "active"}
                  title="Entertainment"
                />
              </Link>
              <Link to="/groups" className="sidebarLink">
                <SidebarRow
                  Icon={EmojiFlagsIcon}
                  isActive={isActive === "groups" && "active"}
                  title="Groups"
                />
              </Link>
              <Link to="/pages" className="sidebarLink">
                <SidebarRow
                  Icon={TableChartOutlinedIcon}
                  title="Pages"
                  isActive={isActive === "pages" && "active"}
                />
              </Link>
              <Link to="/notifications" className="sidebarLink">
                <SidebarRow
                  Icon={NotificationsIcon}
                  title="Notifications"
                  isActive={isActive === "notifications" && "active"}
                />
              </Link>

              <Link to="/messages" className="sidebarLink">
                <SidebarRow Icon={ChatIcon} title="Messages" />
              </Link>
            </div>
          </div>
        )}
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
              dataLength={results.length}
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
        <Link to="/" className="headerOptionLink">
          <div
            className={`header__option ${
              isActive === "home" && "header__option--active"
            }`}
          >
            <HomeIcon fontSize="large" className="header__optionIcon" />
          </div>
        </Link>
        <Link to="/notifications">
          <div
            className={`header__option ${
              isActive === "notifications" && "header__option--active"
            }`}
          >
            <NotificationsIcon
              fontSize="large"
              className="header__optionIcon"
            />
          </div>
        </Link>
        <Link to="/messages" className="headerOptionLink">
          <div
            className={`header__option ${
              isActive === "messages" && "header__option--active"
            }`}
          >
            <TextsmsIcon fontSize="large" className="header__optionIcon" />
          </div>
        </Link>
        <Link to="/store">
          <div
            className={`header__option ${
              isActive === "store" && "header__option--active"
            }`}
          >
            <StoreIcon fontSize="large" className="header__optionIcon" />
          </div>
        </Link>
      </div>

      <div className="header__right">
        <Link to={"/users/" + user.uid} className="headerProfileLink">
          <div className="header__info">
            <Avatar src={user.photoURL} alt="" />
            <h4>{user.displayName}</h4>
          </div>
        </Link>
        <Button className="logoutButton" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
