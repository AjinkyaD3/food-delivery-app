// import axios from "axios";
// import { createContext, useEffect, useState, useRef } from "react";

// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId") || "");
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [food_list, setFoodList] = useState([]);
//   const [restaurants, setRestaurants] = useState([]);
//   const [promoCode, setPromoCode] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const buttonRef = useRef(null);
//   const url = "http://localhost:4000";

//   // ✅ Debugging Helper Function
//   const debugContext = () => {
//     console.log("🛒 Cart Items:", cartItems);
//     console.log("🏠 Restaurant ID:", restaurantId);
//     console.log("🔑 Token:", token);
//     console.log("🍔 Food List:", food_list);
//     console.log("📍 Restaurants:", restaurants);
//   };

//   // ✅ Fetch Food List
//   const fetchFoodList = async () => {
//     try {
//       const response = await axios.get(`${url}/api/food/list`);
//       setFoodList(response.data.data || []);
//     } catch (error) {
//       console.error("❌ Error fetching food list:", error);
//     }
//   };

//   // ✅ Fetch Restaurants List
//   const fetchRestaurants = async () => {
//     try {
//       const response = await axios.get(`${url}/api/restaurants/list/`);
//       setRestaurants(response.data.data || []);
//     } catch (error) {
//       console.error("❌ Error fetching restaurants:", error);
//     }
//   };

//   // ✅ Load Cart Data
//   const loadCartData = async () => {
//     if (!token) {
//       const localCart = JSON.parse(localStorage.getItem("cart")) || {};
//       setCartItems(localCart);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${url}/api/cart/get`,
//         {},
//         { headers: { token } }
//       );
//       const fetchedCart = response.data.cartData || {};
//       setCartItems(fetchedCart);
//       localStorage.setItem("cart", JSON.stringify(fetchedCart));
//     } catch (error) {
//       console.error("❌ Error fetching cart data:", error);
//       setCartItems({});
//     }
//   };

//   useEffect(() => {
//     console.log("🚀 Context Loaded: Fetching Data...");
//     fetchFoodList();
//     fetchRestaurants();
//     loadCartData();
//   }, [token]);

//   // ✅ Add to Cart Function (Fixed Logic)
//   const addToCart = async (item) => {
//     console.log(`➕ addToCart called: itemId=${item._id}, restaurantId=${item.restaurant_id}`);

//     if (cartItems[item._id]) {
//       // ✅ Increase Quantity if Item Exists
//       setCartItems((prev) => {
//         const updatedCart = {
//           ...prev,
//           [item._id]: { ...prev[item._id], quantity: prev[item._id].quantity + 1 },
//         };
//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         return updatedCart;
//       });

//       return;
//     }

//     // ✅ Clear Cart if Adding from Different Restaurant (ONLY if cart has items)
//     if (Object.keys(cartItems).length > 0 && restaurantId !== item.restaurant_id) {
//       const confirmChange = window.confirm(
//         "Your cart contains items from a different restaurant. Do you want to clear the cart and add new items?"
//       );
//       if (!confirmChange) return;

//       setCartItems({});
//       localStorage.removeItem("cart");
//       setRestaurantId("");
//       localStorage.removeItem("restaurantId");
//     }

//     // ✅ Add New Item to Cart
//     setCartItems((prev) => {
//       const updatedCart = {
//         ...prev,
//         [item._id]: { ...item, quantity: 1 },
//       };
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//       return updatedCart;
//     });

//     // ✅ Set Restaurant ID if First Item is Added
//     if (!restaurantId || Object.keys(cartItems).length === 0) {
//       setRestaurantId(item.restaurant_id);
//       localStorage.setItem("restaurantId", item.restaurant_id);
//     }

//     // ✅ API Update (if logged in)
//     if (token) {
//       try {
//         await axios.post(
//           `${url}/api/cart/add`,
//           {
//             itemId: item._id,
//             name: item.name,
//             price: item.price,
//             image_url: item.image_url,
//             restaurant_id: item.restaurant_id,
//           },
//           { headers: { token } }
//         );
//       } catch (error) {
//         console.error("❌ Error adding item to cart:", error);
//       }
//     }
//   };

//   // ✅ Remove from Cart Function (Fixed Logic)
//   const removeFromCart = async (itemId) => {
//     console.log(`➖ removeFromCart called: itemId=${itemId}`);

//     setCartItems((prev) => {
//       const updatedCart = { ...prev };

//       if (updatedCart[itemId]?.quantity > 1) {
//         // ✅ Reduce Quantity (But NOT Remove the Item)
//         updatedCart[itemId].quantity -= 1;
//       } else {
//         // ✅ Remove Item if Quantity is 1
//         delete updatedCart[itemId];
//       }

//       localStorage.setItem("cart", JSON.stringify(updatedCart));

//       // ✅ Clear Restaurant ID if Cart is Empty
//       if (Object.keys(updatedCart).length === 0) {
//         setRestaurantId("");
//         localStorage.removeItem("restaurantId");
//       }

//       return updatedCart;
//     });

//     // ✅ API Update (if logged in)
//     if (token) {
//       try {
//         await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
//       } catch (error) {
//         console.error("❌ Error removing item from cart:", error);
//       }
//     }
//   };

//   // ✅ Get Total Cart Amount (Fixed)
//   const getTotalCartAmount = () => {
//     let total = Object.keys(cartItems).reduce((sum, itemId) => {
//       const item = cartItems[itemId]; // ✅ Directly fetch from cartItems
//       return sum + (item?.price || 0) * (item?.quantity || 0);
//     }, 0);
  
//     return Math.max(total - discount, 0); // ✅ Apply discount safely
//   };
  

//   // ✅ Apply Promo Code
//   const applyPromoCode = (code) => {
//     const promoCodes = { SAVE20: 20, DISCOUNT50: 50, FREESHIP: 99 };
//     setDiscount(promoCodes[code] || 0);
//     setPromoCode(code);
//   };

//   const contextValue = {
//     food_list,
//     restaurants,
//     cartItems,
//     restaurantId,
//     setCartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     applyPromoCode,
//     promoCode,
//     discount,
//     url,
//     token,
//     setToken,
//     buttonRef,
//     debugContext,
//   };

//   return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
// };

// export default StoreContextProvider;
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

  useEffect(() => {
    fetchFoodList();
    fetchRestaurants();
    loadCartData();
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

      updateCart({});
    }

    updateCart({ ...cartItems, [item._id]: { ...item, quantity: 1 } });

    if (!restaurantId) {
      setRestaurantId(item.restaurant_id);
      localStorage.setItem("restaurantId", item.restaurant_id);
    }

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
