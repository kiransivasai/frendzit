import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { auth } from "./firebase";
import Home from "./components/Home";
import PostView from "./components/PostView";
import UserProfile from "./UserProfile";
import Messages from "./components/Messages";

function App() {
  const [user, setUser] = useState("");
  const [pending, setPending] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(false);
      }
      setPending(false);
    });
  }, []);
  if (pending) {
    return (
      <div className="app">
        <h3>Loading....</h3>
      </div>
    );
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
            exact
            path="/users/:id"
            render={(props) => (
              <UserProfile user={user} {...props.match.params} />
            )}
          />
          <Route path="/messages">
            <Messages user={user} />
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
