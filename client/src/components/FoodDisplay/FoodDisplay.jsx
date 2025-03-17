import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list, restaurants } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      {/* 🔹 Temporarily removed "Top dishes near you" */}
      {/* <h2>Top dishes near you</h2> */}

      {/* ✅ Display Restaurants */}
      <h2>Nearby Restaurants</h2>
      {restaurants.length > 0 ? (
        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-card">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <h3 className="restaurant-name">{restaurant.name}</h3>

              {/* ✅ Fix: Display only required location details */}
              {restaurant.location && (
                <p className="restaurant-location">
                  {restaurant.location.address}, {restaurant.location.city}, {restaurant.location.state}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No restaurants found.</p> 
      )}
    </div>
  );
};

export default FoodDisplay;
