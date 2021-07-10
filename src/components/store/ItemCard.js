import { Button } from "@material-ui/core";
import React from "react";
import "./ItemCard.css";

function ItemCard({ title, imageURL, desc, price, storename }) {
  return (
    <div className="itemCard">
      <div className="itemCard__image">
        <img alt="product" src={"https://ebeemart.com/public/" + imageURL} />
      </div>
      <div className="itemCard__title">
        <h2>{title}</h2>
      </div>
      <div className="itemCard__details">
        <p className="itemCard__desc">{desc}</p>
        <p className="itemCard__price">&#8377;{price}</p>
        <p className="itemCard__storename">{storename}</p>
      </div>
      <div className="itemCard__button">
        <Button className="shopNow">Shop Now</Button>
      </div>
    </div>
  );
}

export default ItemCard;
