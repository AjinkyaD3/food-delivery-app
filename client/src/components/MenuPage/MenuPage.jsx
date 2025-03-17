import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./MenuPage.css";

const MenuPage = () => {
  const { addToCart, url } = useContext(StoreContext);
  const { restaurantId } = useParams(); // ✅ Get restaurantId from URL
  const [menuItems, setMenuItems] = useState([]); // ✅ State for menu items

  // ✅ Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${url}/api/menu/${restaurantId}`);
        setMenuItems(response.data.data.food_items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>

      {/* ✅ Display menu items */}
      <div className="menu-items">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item._id} className="menu-item">
              <img src={`${url}/${item.image_url}`} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p>{item.description}</p>

              {/* ✅ Add to Cart Button */}
              <button onClick={() => addToCart(item._id)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>Loading menu items...</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
