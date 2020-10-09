import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "./assets/logo.png";
import "./Register.css";
import { db, auth, storage } from "./firebase";
import firebase from "firebase";
import ImageIcon from "@material-ui/icons/Image";
import { Button } from "@material-ui/core";

function Register({ user }) {
  const history = useHistory("");
  if (user) {
    history.push("/login");
  }
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastname] = useState("");
  const [profile, setProfile] = useState("");
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

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfile(e.target.files[0]);
      console.log(e.target.files[0].name);
      document.getElementById("dp_text").innerHTML = "Profile Uploaded";
    }
  };
  const handleDp = (e) => {
    document.getElementById("profile_picture").click();
  };
  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        if (auth.user) {
          storage
            .ref("users/" + auth.user.uid + "/profile.jpg")
            .put(profile)
            .then(() => {
              storage
                .ref("users/" + auth.user.uid + "/profile.jpg")
                .getDownloadURL()
                .then((imgUrl) => {
                  auth.user
                    .updateProfile({
                      displayName: firstname + " " + lastname,
                      photoURL: imgUrl,
                    })
                    .then((s) => {
                      const keys = createKeywords(
                        firstname + " " + lastname.toLowerCase()
                      );
                      console.log(keys);
                      db.collection("users")
                        .doc(auth.user.uid)
                        .set({
                          description: "",
                          keys: keys,
                          name: firstname + " " + lastname,
                          photoUrl: imgUrl,
                          time: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .catch((e) => console.log(e));
                    })
                    .catch((error) => {
                      setErrorMsg(error.message);
                    });
                })
                .catch((error) => {
                  setErrorMsg(error.message);
                });
            })
            .catch((error) => {
              setErrorMsg("Error while uploading Profile Picture");
            });
        }
      })
      .catch((error) => {
        if (error.message === "The email address is badly formatted.") {
          setErrorMsg("Enter valid Email Address");
        }
      });
  };

  return (
    <div className="register">
      <div className="register__containerLeft">
        <img src={logo} className="login__logo" alt="Frendzit" />
        <h2>Get Connected &amp; Engage with your Likeminds</h2>
      </div>
      <div className="register__container">
        <img className="register__logo" src={logo} alt="Frendzit" />
        <div className="err__msg">
          <p>{errorMsg}</p>
        </div>
        <form onSubmit={signUp}>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First Name"
            required="true"
          />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last Name"
            required
          />
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

          <Button
            variant="contained"
            color="default"
            className="profile__pic"
            onClick={handleDp}
            startIcon={<ImageIcon />}
          >
            <span id="dp_text">Upload Profile Picture</span>
          </Button>
          <input
            type="file"
            id="profile_picture"
            onChange={handleChange}
            hidden
            required
          />
          <Button type="submit" className="register__registerButton">
            Register
          </Button>
          <p>By Clicking Sign Up, you agree to our Terms and Conditions</p>
          <hr />
          <Link to="/login">
            <Button className="register__loginButton">Login</Button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
