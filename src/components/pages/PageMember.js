import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import "./PageMember.css";

function PageMember({ id, isAdmin, isPageAdmin, user, pageId }) {
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  useEffect(() => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.data()) {
          setName(doc.data().name);
          setPic(doc.data().photoUrl);
        }
      });
  }, [id, isAdmin]);

  return (
    <>
      <Link to={"/users/" + id} className="pageMembers__link">
        <div className="pageMember">
          <Avatar className="liked__person" src={pic} />
          <div className="pageMember__details">
            <h3>{name}</h3>
            {isAdmin ? (
              <p className="admin">
                <div></div>Admin
              </p>
            ) : (
              <p className="member">
                <div></div>Member
              </p>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}

export default PageMember;
