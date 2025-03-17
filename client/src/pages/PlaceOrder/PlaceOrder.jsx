import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, url, cartItems, food_list } = useContext(StoreContext);
  const [pickupTime, setPickupTime] = useState("");
  const [orderType, setOrderType] = useState("takeaway");
  const navigate = useNavigate();
  const { buttonRef } = useContext(StoreContext);

  useEffect(() => {
    if (!token) {
      navigate("/cart");
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }, 100);
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    setPickupTime(now.toISOString().slice(0, 16));
  }, []);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = Object.keys(cartItems).map((itemId) => {
      const item = food_list.find((food) => food._id === itemId);
      return item ? { ...item, quantity: cartItems[itemId], resId: item.resId } : null;
    }).filter(Boolean);

    if (orderItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let orderData = {
      orderType,
      pickupTime: orderType === "takeaway" ? pickupTime : null,
      items: orderItems,
      amount: getTotalCartAmount() + 30,
      resId: orderItems[0]?.resId,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Select Order Type</p>
        <div className="order-type-options">
          <label>
            <input type="radio" name="orderType" value="takeaway" checked={orderType === "takeaway"} onChange={() => setOrderType("takeaway")} />
            Takeaway (Pickup)
          </label>
          <label className="disabled">
            <input type="radio" name="orderType" value="delivery" disabled />
            Delivery (Coming Soon)
          </label>
        </div>

        {orderType === "takeaway" && (
          <div className="pickup-time">
            <label>Pickup Time:</label>
            <input
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Platform Fee</p>
              <p>₹30</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() + 30}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
