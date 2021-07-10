import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import PagePostsFeed from "./PagePostsFeed";
import PagePostUploader from "./PagePostUploader";
import PageTopCard from "./PageTopCard";
import "./PageView.css";

function PageView({ user, id }) {
  const history = useHistory("");
  if (!user) {
    history.push("/login");
  }
  const [pageAdmins, setPageAdmins] = useState("");
  useEffect(() => {
    db.collection("pages")
      .doc(id)
      .onSnapshot((doc) => {
        setPageAdmins(doc.data().createdBy);
      });
  }, [id]);
  return (
    <div className="pageView">
      <PageTopCard user={user} id={id} />
      {pageAdmins === user.uid && <PagePostUploader user={user} id={id} />}
      <PagePostsFeed user={user} id={id} />
    </div>
  );
}

export default PageView;
