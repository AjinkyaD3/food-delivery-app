import React from "react";
import "./Order.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    console.log("response of admin page-->", response.data);
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <>
      <div className="order add">
        <h3>Order Page</h3>
        <div className="order-list">
          {orders.map((order, index) => {
            return (
              <div key={index} className="order-item">
                <p className="order-date">
                  Order Date: {new Date(order.date).toLocaleString()}
                </p>

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-details">
                      <img src={`http://localhost:4000/${item.image_url}`} alt={item.name} />
                      <p>{item.name} x {item.quantity}</p>
                      <p>₹ {item.price}</p>
                    </div>
                  ))}
                </div>

                <p className="order-amount">Total Amount: ₹ {order.amount}</p>
                <p className="order-payment">
                  Payment Status: {order.payment ? "Paid" : "Pending"}
                </p>

                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready to Pickup</option>
                </select>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
};

export default Orders;
