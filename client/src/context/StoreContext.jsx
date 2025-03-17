import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const buttonRef = useRef(null);
  const url = "http://localhost:4000";

  // ✅ Debugging Helper Function
  const debugContext = () => {
    console.log("🛒 Cart Items:", cartItems);
    console.log("🏠 Restaurant ID:", restaurantId);
    console.log("🔑 Token:", token);
    console.log("🍔 Food List:", food_list);
    console.log("📍 Restaurants:", restaurants);
  };

  // ✅ Fetch Food List
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
      console.log("✅ Fetched Food List:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching food list:", error);
    }
  };

  // ✅ Fetch Restaurants List
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurants/list/`);
      setRestaurants(response.data.data || []);
      console.log("✅ Fetched Restaurants:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching restaurants:", error);
      setRestaurants([]);
    }
  };

  // ✅ Load Cart Data
  const loadCartData = async () => {
    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCartItems(localCart);
      console.log("✅ Loaded cart from localStorage:", localCart);
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      const fetchedCart = response.data.cartData || {};
      setCartItems(fetchedCart);
      localStorage.setItem("cart", JSON.stringify(fetchedCart));
      console.log("✅ Loaded Cart from API:", fetchedCart);
    } catch (error) {
      console.error("❌ Error fetching cart data:", error);
      localStorage.removeItem("cart");
      setCartItems({});
    }
  };

  useEffect(() => {
    console.log("🚀 Context Loaded: Fetching Data...");
    const loadData = async () => {
      await fetchFoodList();
      await fetchRestaurants();
      await loadCartData();
    };
    loadData();
  }, [token]);

  // ✅ Add to Cart Function
  const addToCart = async (itemId, newRestaurantId) => {
    console.log(`➕ addToCart called: itemId=${itemId}, newRestaurantId=${newRestaurantId}`);

    try {
      if (restaurantId && restaurantId !== newRestaurantId) {
        const confirmChange = window.confirm(
          "Your cart contains items from a different restaurant. Do you want to clear the cart and add new items?"
        );
        if (!confirmChange) return;

        setCartItems({});
        localStorage.removeItem("cart");
        setRestaurantId(newRestaurantId);
        localStorage.setItem("restaurantId", newRestaurantId);
      }

      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
        console.log(`✅ Item added to cart in API: ${itemId}`);
      }

      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        console.log("🛒 Updated Cart:", updatedCart);
        return updatedCart;
      });

      if (!restaurantId) {
        setRestaurantId(newRestaurantId);
        localStorage.setItem("restaurantId", newRestaurantId);
      }
    } catch (error) {
      console.error("❌ Error adding item to cart:", error);
    }
  };

  // ✅ Remove from Cart Function
  const removeFromCart = async (itemId) => {
    console.log(`➖ removeFromCart called: itemId=${itemId}`);

    try {
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
        console.log(`✅ Item removed from cart in API: ${itemId}`);
      }

      setCartItems((prev) => {
        const updatedCart = { ...prev };
        if (updatedCart[itemId] > 1) {
          updatedCart[itemId] -= 1;
        } else {
          delete updatedCart[itemId];
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        console.log("🛒 Updated Cart after removal:", updatedCart);
        return updatedCart;
      });

      if (Object.keys(cartItems).length === 1) {
        setRestaurantId("");
        localStorage.removeItem("restaurantId");
      }
    } catch (error) {
      console.error("❌ Error removing item from cart:", error);
    }
  };

  // ✅ Get Total Cart Amount (Including Discount)
  const getTotalCartAmount = () => {
    let total = Object.keys(cartItems).reduce((sum, itemId) => {
      const item = food_list.find((product) => product._id === itemId);
      return sum + (item ? item.price * cartItems[itemId] : 0);
    }, 0);
    return Math.max(total - discount, 0);
  };

  // ✅ Apply Promo Code
  const applyPromoCode = (code) => {
    const promoCodes = { SAVE20: 20, DISCOUNT50: 50, FREESHIP: 99 };

    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
    } else {
      setDiscount(0);
    }
    setPromoCode(code);
  };

  const contextValue = {
    food_list,
    restaurants,
    cartItems,
    restaurantId,
    setCartItems,
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
    debugContext, // ✅ Added Debug Function
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
