import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const MenuPage = () => {

  // ===========
 
  // ===========
  const { addToCart, url } = useContext(StoreContext);
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/menu/${restaurantId}`);
        setMenuItems(response.data.data?.food_items || []); // ✅ Handle missing food_items
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId, url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-center">Restaurant Menu</h1>
      </div>
 

      {/* Menu Items List */}
      <div className="space-y-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item._id} className="flex border-b pb-4">
              <div className="w-20 h-20 mr-4">
                <img
                  src={`${url}/${item.image_url}`}
                  alt={item.name || "Food Item"}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-image.jpg"; // ✅ Fallback image
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-medium">₹{item.price}</p>
                  <button
                    onClick={() => {
                      console.log("🛒 Button Clicked - Item Data:", {
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                        restaurant_id: restaurantId,
                      });
                      addToCart({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                        restaurant_id: restaurantId,
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-transform transform hover:scale-105"
                  >
                    Add to Cart
                  </button>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No menu items available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
