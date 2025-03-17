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
  } = useContext(StoreContext);

  const [enteredPromo, setEnteredPromo] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ✅ Ensure food list is loaded before rendering
  useEffect(() => {
    console.log("📦 cartItems:", cartItems); // Debugging

  }, [, cartItems]); // Ensure we check when cart updates
  

  // ✅ Handle promo code application
  const handleApplyPromo = () => {
    applyPromoCode(enteredPromo);
  };

  if (loading) return <p>Loading cart...</p>;

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

            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <React.Fragment key={item._id}>
                    <div className="cart-items-title cart-items-item">
                      <img src={`${url}/images/${item.image}`} alt={item.name} />
                      <p>{item.name}</p>
                      <p>₹{item.price}</p>

                      <div className="cart-quantity-controls">
                        <button
                          className="cart-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          -
                        </button>
                        <span>{cartItems[item._id]}</span>
                        <button
                          className="cart-btn"
                          onClick={() => addToCart(item._id)}
                        >
                          +
                        </button>
                      </div>

                      <p>₹{item.price * cartItems[item._id]}</p>
                      <p onClick={() => removeFromCart(item._id)} className="cross">
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
            {/* Total Price Section */}
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>₹{getTotalCartAmount() + discount}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>₹{getTotalCartAmount() === 0 ? 0 : 99}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 99}</b>
                </div>
              </div>
              <button
                disabled={getTotalCartAmount() === 0}
                onClick={() => navigate("/order")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

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
