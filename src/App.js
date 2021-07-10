import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { auth, database } from "./firebase";
import Home from "./components/Home";
import PostView from "./components/PostView";
import UserProfile from "./UserProfile";
import Spinner from "./Spinner";
import Messages from "./components/messages/Messages";
import Friends from "./components/friends/Friends";
import Entertainment from "./components/entertainment/Entertainment";
import Group from "./components/groups/Group";
import GroupInfo from "./components/groups/GroupInfo";
import Page from "./components/pages/Page";
import PageInfo from "./components/pages/PageInfo";
import Classroom from "./components/classrooms/Classroom";
import Test from "./Test";
import ClassroomInfo from "./components/classrooms/ClassroomInfo";
import PagePostView from "./components/pages/PagePostView";
import GroupPostView from "./components/groups/GroupPostView";
import ClassroomPostView from "./components/classrooms/ClassroomPostView";
import Notifications from "./components/notifications/Notifications";
import Store from "./components/store/Store";

function App() {
  const [user, setUser] = useState("");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const databaseReference = database
          .ref()
          .child("status/" + authUser.uid);
        databaseReference.set(1).then((value) => {
          databaseReference.onDisconnect().set(0);
        });
        databaseReference.on("value", (snapshot) => {
          databaseReference.set(1).then((value) => {
            databaseReference.onDisconnect().set(0);
          });
        });
      } else {
        setUser(false);
      }
      setPending(false);
    });
  }, []);
  if (pending) {
    return <Spinner />;
  }

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/login">
            <Login user={user} />
          </Route>
          <Route path="/register">
            <Register user={user} />
          </Route>
          <Route
            exact
            path="/post/:id"
            render={(props) => <PostView user={user} {...props.match.params} />}
          />
          <Route
            path="/pg/:id"
            render={(props) => (
              <PagePostView user={user} {...props.match.params} />
            )}
          />
          <Route
            path="/grp/:id"
            render={(props) => (
              <GroupPostView user={user} {...props.match.params} />
            )}
          />
          <Route
            path="/cls/:id"
            render={(props) => (
              <ClassroomPostView user={user} {...props.match.params} />
            )}
          />
          <Route
            exact
            path="/users/:id"
            render={(props) => (
              <UserProfile
                key={props.match.params.id}
                user={user}
                {...props.match.params}
              />
            )}
          />
          <Route
            exact
            path="/message/:id"
            render={(props) => <Messages user={user} {...props.match.params} />}
          />
          <Route path="/messages">
            <Messages user={user} />
          </Route>
          <Route
            exact
            path="/friend/:id"
            render={(props) => <Friends user={user} {...props.match.params} />}
          />
          <Route path="/friends">
            <Friends user={user} />
          </Route>
          <Route path="/entertainment">
            <Entertainment user={user} />
          </Route>
          <Route path="/groups">
            <Group user={user} />
          </Route>
          <Route
            exact
            path="/group/:id"
            render={(props) => (
              <GroupInfo user={user} {...props.match.params} />
            )}
          />
          <Route path="/pages">
            <Page user={user} />
          </Route>
          <Route path="/store">
            <Store user={user} />
          </Route>
          <Route path="/notifications">
            <Notifications user={user} />
          </Route>
          <Route
            exact
            path="/page/:id"
            render={(props) => <PageInfo user={user} {...props.match.params} />}
          />
          <Route path="/classroom">
            <Classroom user={user} />
          </Route>
          <Route
            exact
            path="/class/:id"
            render={(props) => (
              <ClassroomInfo user={user} {...props.match.params} />
            )}
          />
          <Route path="/test">
            <Test user={user} />
          </Route>
          <Route path="/">
            <Home user={user} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
