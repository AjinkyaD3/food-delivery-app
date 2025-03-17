
import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const buttonRef = useRef(null);
  const url = "http://localhost:4000";
     
  console.log("cart itemsssss",cartItems);
  useEffect(() => {
    fetchFoodList();
    fetchRestaurants();
    // loadCartData();
  }, [token]);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching food list:", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurants/list/`);
      setRestaurants(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching restaurants:", error);
    }
  };

  const loadCartData = async () => {
    if (!token) {
      setCartItems(JSON.parse(localStorage.getItem("cart")) || {});
      return;
    }

    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
      const fetchedCart = response.data.cartData || {};
      setCartItems(fetchedCart);
      localStorage.setItem("cart", JSON.stringify(fetchedCart));
    } catch (error) {
      console.error("❌ Error fetching cart data:", error);
      setCartItems({});
    }
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    if (Object.keys(newCart).length === 0) {
      setRestaurantId("");
      localStorage.removeItem("restaurantId");
    }
  };

  const addToCart = async (item) => {
    if (cartItems[item._id]) {
      updateCart({
        ...cartItems,
        [item._id]: { ...cartItems[item._id], quantity: cartItems[item._id].quantity + 1 },
      });
      return;
    }
  
    if (Object.keys(cartItems).length > 0 && restaurantId !== item.restaurant_id) {
      const confirmChange = window.confirm(
        "Your cart contains items from a different restaurant. Clear the cart and add new items?"
      );
      if (!confirmChange) return;
  
      // ✅ Ensure the cart is cleared first before proceeding
      await new Promise((resolve) => {
        updateCart({});
        setTimeout(resolve, 0); // Small delay to allow state update
      });
  
      setRestaurantId(item.restaurant_id);
      localStorage.setItem("restaurantId", item.restaurant_id);
    }
  
    const newCart = { ...cartItems, [item._id]: { ...item, quantity: 1 } };
    updateCart(newCart);
  
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId: item._id, ...item },
          { headers: { token } }
        );
      } catch (error) {
        console.error("❌ Error adding item to cart:", error);
      }
    }
  };
  

  const removeFromCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId]?.quantity > 1) {
      updatedCart[itemId].quantity -= 1;
    } else {
      delete updatedCart[itemId];
    }

    updateCart(updatedCart);

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("❌ Error removing item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = Object.values(cartItems).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    return Math.max(total - discount, 0);
  };

  const applyPromoCode = (code) => {
    const promoCodes = { SAVE20: 20, DISCOUNT50: 50, FREESHIP: 99 };
    setDiscount(promoCodes[code] || 0);
    setPromoCode(code);
  };

  return (
    <StoreContext.Provider
      value={{
        food_list,
        restaurants,
        cartItems,
        restaurantId,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        applyPromoCode,
        promoCode,
        discount,
        url,
        token,
        setToken,
        buttonRef,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
