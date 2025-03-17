import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const buttonRef = useRef(null);
  const url = "http://localhost:4000";

  // ✅ Fetch Food List
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Fetch Restaurants List
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurants/list/`);
      setRestaurants(response.data.data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
    }
  };

  // ✅ Load Cart Data
  const loadCartData = async () => {
    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCartItems(localCart);
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
    } catch (error) {
      console.error("Error fetching cart data:", error);
      localStorage.removeItem("cart"); // Clear local storage if API call fails
      setCartItems({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      await fetchRestaurants();
      await loadCartData();
    };
    loadData();
  }, [token]); // 🔥 Added token dependency to re-fetch cart when user logs in/out

  // ✅ Add to Cart Function
  const addToCart = async (itemId) => {
    try {
      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      }
      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // ✅ Remove from Cart Function
  const removeFromCart = async (itemId) => {
    try {
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      }
      setCartItems((prev) => {
        const updatedCart = { ...prev };
        if (updatedCart[itemId] > 1) {
          updatedCart[itemId] -= 1;
        } else {
          delete updatedCart[itemId];
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
