import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import StoreItems from "./StoreItems";
import "./Store.css";

function Store({ user }) {
  return (
    <div className="store">
      <Header user={user} isActive={"store"} />
      <div className="store__body">
        <Sidebar user={user} isActive={"store"} />
        <StoreItems />
      </div>
    </div>
  );
}

export default Store;
