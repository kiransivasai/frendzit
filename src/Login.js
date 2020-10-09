import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "./assets/logo.png";
import { db, auth, provider } from "./firebase";
import "./Login.css";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import googleLogo from "./assets/google.svg";

function Login({ user }) {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createKeywords = (name) => {
    const arrName = [];
    let curName = "";
    name.split("").forEach((letter) => {
      if (letter === " ") {
        curName = "";
      } else {
        curName += letter;
        arrName.push(curName);
      }
    });
    return arrName;
  };

  if (user) {
    history.push("/");
  }
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        console.log(auth);
      })
      .catch((e) => {
        if (
          e.message ===
          "There is no user record corresponding to this identifier. The user may have been deleted."
        ) {
          setErrorMsg("Invalid Credentials");
        } else if (e.message === "The email address is badly formatted.") {
          setErrorMsg("Enter Valid Email Address");
        } else if (
          e.message ===
          "The password is invalid or the user does not have a password."
        ) {
        } else {
          setErrorMsg("Enter Valid Password");
        }
      });
  };
  const handleGoogle = (e) => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        const keys = createKeywords(res.user.displayName.toLowerCase());
        if (res.additionalUserInfo.isNewUser) {
          db.collection("users")
            .doc(res.user.uid)
            .set({
              description: "",
              keys: keys,
              name: res.user.displayName,
              photoUrl: res.user.photoURL,
              time: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="login">
      <div className="login__containerLeft">
        <img src={logo} className="login__logo" alt="Frendzit" />
        <h2>Get Connected &amp; Engage with your Likeminds</h2>
      </div>

      <div className="login__container">
        <img className="login__logo" src={logo} alt="Frendzit" />
        <div className="err__msg">
          <p>{errorMsg}</p>
        </div>
        <form onSubmit={signIn}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button type="submit" className="login__loginButton">
            Log In
          </Button>
          <Button
            type="button"
            className="google__signin"
            onClick={handleGoogle}
          >
            <img src={googleLogo} alt="" width="20" height="20" />
            &nbsp;Sign in with Google
          </Button>
          <h5>Forgot Password? </h5>
          <hr />
          <Link to="/register">
            <Button className="login__registerButton">Create an Account</Button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
