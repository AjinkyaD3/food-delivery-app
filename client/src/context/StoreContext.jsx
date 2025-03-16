import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [restaurants, setRestaurants] = useState([]); // ✅ New State for Restaurants
  const buttonRef = useRef(null);
  const url = "http://localhost:4000";

  // ✅ Fetch Food List
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Fetch Restaurants List
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(url + "/api/restaurants/list/");
      console.log("Fetched Restaurants:", response.data); // 🔹 Debugging
      setRestaurants(response.data.data || []); // ✅ Ensure it's an array
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]); // Prevent infinite loading
    }
  };
  

  // ✅ Load Cart Data
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchRestaurants(); // ✅ Fetch restaurants when app loads

      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    restaurants, // ✅ Now available in context
    cartItems,
    setCartItems,
    addToCart: async (itemId) => {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
      if (token) {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      }
    },
    removeFromCart: async (itemId) => {
      setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 0) }));
      if (token) {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      }
    },
    getTotalCartAmount: () => {
      return Object.keys(cartItems).reduce((total, itemId) => {
        const itemInfo = food_list.find((product) => product._id === itemId);
        return total + (itemInfo ? itemInfo.price * cartItems[itemId] : 0);
      }, 0);
    },
    url,
    token,
    setToken,
    buttonRef,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
