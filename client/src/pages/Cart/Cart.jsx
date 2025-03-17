import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    applyPromoCode,
    promoCode,
    discount,
    url,
    food_list
  } = useContext(StoreContext);

  const [enteredPromo, setEnteredPromo] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const totalCartAmount = getTotalCartAmount(); // Store result to avoid multiple function calls

  // ✅ Ensure food list is loaded before rendering
  useEffect(() => {
    console.log("📦 cartItems:", cartItems); // Debugging

  }, [cartItems]); // Ensure we check when cart updates


  // ✅ Handle promo code application
  const handleApplyPromo = () => {
    applyPromoCode(enteredPromo);
  };

  // if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      {Object.keys(cartItems).length === 0 ? (
        <p>Your cart is empty! Add some items to proceed.</p>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <hr />

            {cartItems &&
              Object.keys(cartItems).map((itemId) => {
                const item = cartItems[itemId];

                // Debugging logs
                console.log("🛒 Cart Item Debug:", itemId, item);

                // Ensure item exists and has a quantity > 0 before rendering
                if (item && item.quantity > 0) {
                  return (
                    <React.Fragment key={itemId}>
                      <div className="cart-items-title cart-items-item">
                        {/* Product Image */}
                        <img
                          src={`${url}/images/${item.image_url || "default.jpg"}`}
                          alt={item.name || "Unnamed Item"}
                          className="cart-item-image"
                        />

                        {/* Product Name */}
                        <p className="cart-item-name">{item.name || "Unnamed Item"}</p>

                        {/* Product Price */}
                        <p className="cart-item-price">₹{item.price || 0}</p>

                        {/* Quantity Controls */}
                        <div className="cart-quantity-controls">
                          <button
                            className="cart-btn"
                            onClick={() => removeFromCart(itemId)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="cart-btn"
                            onClick={() => addToCart(item)} // Fix: Passing full item, not just ID
                          >
                            +
                          </button>
                        </div>

                        {/* Total Price */}
                        <p className="cart-item-total-price">
                          ₹{(item.price || 0) * item.quantity}
                        </p>

                        {/* Remove Item */}
                        <p
                          onClick={() => removeFromCart(itemId)}
                          className="cart-item-remove cross"
                        >
                          x
                        </p>
                      </div>
                      <hr />
                    </React.Fragment>
                  );
                }
                return null;
              })}



          </div>

          {/* Bottom Section */}
          

<div className="cart-bottom">
    <div className="cart-total">
        <h2>Cart Total</h2>
        <div>
            <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{totalCartAmount + discount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{totalCartAmount === 0 ? 0 : 99}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                <b>Total</b>
                <b>₹{totalCartAmount === 0 ? 0 : totalCartAmount + 99}</b>
            </div>
        </div>
        <button
            disabled={totalCartAmount === 0}
            onClick={() => navigate("/order")}
        >
            PROCEED TO CHECKOUT
        </button>
   
</div>;


            {/* Promo Code Section */}
            <div className="cart-promocode">
              <p>If you have a promo code, enter it here:</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={enteredPromo}
                  onChange={(e) => setEnteredPromo(e.target.value)}
                />
                <button onClick={handleApplyPromo}>Submit</button>
              </div>
              {promoCode && (
                <p>
                  Applied Promo Code: {promoCode} (-₹{discount})
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
