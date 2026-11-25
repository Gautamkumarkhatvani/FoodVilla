import { useEffect, useState } from "react";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import API from "../api/axios";
import "../styles/index.css";

const OrderHistory = () => {
  const { customer } = useCustomerAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await API.get(
          `/orders/user/${customer.email}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Order history fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  /* NOT LOGGED IN */
  if (!customer) {
    return (
      <div className="order-history-container">
        <h2>Please login to view your orders</h2>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">My Orders</h2>

      {loading && <p className="order-loading">Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="order-empty">
          You haven’t placed any orders yet.
        </p>
      )}

      {!loading &&
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-row">
              <span>Total</span>
              <strong>₹{order.totalAmount}</strong>
            </div>

            <div className="order-row">
              <span>Status</span>
              <span
                className={`order-status ${order.status}`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  {item.title} × {item.qty}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderHistory;
