import React, { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import "./StoreItems.css";

function StoreItems() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("http://ebeemart.com/api")
      .then((res) => res.json())
      .then((json) => {
        setItems(json);
      });
  }, []);

  return (
    <div className="storeItems">
      <h1>Marketplace</h1>
      <div className="storeItems__body">
        {items.map((item) => (
          <ItemCard
            title={item.prod_name}
            imageURL={item.prod_image}
            desc={item.product_description}
            price={item.prod_price}
            storename={item.store_name}
            key={item.prod_image}
          />
        ))}
      </div>
    </div>
  );
}

export default StoreItems;
