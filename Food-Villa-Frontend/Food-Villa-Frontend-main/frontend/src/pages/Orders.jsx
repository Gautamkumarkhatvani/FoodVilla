import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const email = localStorage.getItem("customerEmail");

  useEffect(() => {
    if (!email) return;

    const fetchOrders = async () => {
      try {
        const res = await API.get(`/orders/user/${email}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error("Order fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  if (!email) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Please login to view orders</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
        <h2 style={{ marginBottom: 30 }}>My Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              padding: 20,
              marginBottom: 20,
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            }}
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {order.status}
              </span>
            </p>

            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>

            <p style={{ marginTop: 10 }}>
              <strong>Items:</strong>
            </p>

            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.title} × {item.qty} — ₹{item.price}
                </li>
              ))}
            </ul>

            <p style={{ marginTop: 10, fontSize: 13, color: "#777" }}>
              Ordered on:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Order;
