import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { StoreContext } from "../../context/StoreContext";
import "./FoodDisplay.css";

const FoodDisplay = ({ category }) => {
  const { restaurants } = useContext(StoreContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/menu/${restaurantId}`); // Navigate to menu page with restaurant ID
  };

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2 className="section-title">Nearby Restaurants</h2>
        {category && <span className="category-tag">{category}</span>}
      </div>

      {restaurants.length > 0 ? (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id} 
              className="restaurant-card" 
              onClick={() => handleRestaurantClick(restaurant._id)} // Add click event
              style={{ cursor: "pointer" }} // Indicate clickable area
            >
              <div className="image-container">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                <div className="restaurant-badge">Open Now</div>
              </div>
              
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                
                <div className="restaurant-meta">
                  <span className="rating">
                    <i className="fa fa-star"></i> 
                    {restaurant.rating || "4.5"}
                  </span>
                  <span className="dot-separator">•</span>
                  <span className="delivery-time">
                    {restaurant.deliveryTime || "25-35"} min
                  </span>
                </div>
                
                {restaurant.location && (
                  <p className="restaurant-location">
                    {restaurant.location.address}, {restaurant.location.city}
                  </p>
                )}
                
                <div className="restaurant-tags">
                  {restaurant.cuisineType && 
                    restaurant.cuisineType.split(',').map((cuisine, index) => (
                      <span key={index} className="cuisine-tag">{cuisine.trim()}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <p>No restaurants found in this area.</p>
          <button className="refresh-button">Try another location</button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
