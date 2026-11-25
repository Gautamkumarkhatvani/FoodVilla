import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/index.css";

const ITEMS_PER_PAGE = 7;

const statusPriority = {
  pending: 1,
  confirmed: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: 5,
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin/all");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 INITIAL FETCH + AUTO REFRESH */
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  /* 🔄 UPDATE ORDER STATUS */
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await API.put(`/orders/admin/status/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* 🔥 SORT BY STATUS PRIORITY */
  const sortedOrders = [...orders].sort(
    (a, b) =>
      statusPriority[a.status] - statusPriority[b.status]
  );

  /* 📄 PAGINATION */
  const totalPages = Math.ceil(
    sortedOrders.length / ITEMS_PER_PAGE
  );

  const safePage =
    currentPage > totalPages ? 1 : currentPage;

  const pageOrders = sortedOrders.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <div className="aol-wrapper">
      <h2 className="aol-title">Orders</h2>

      {loading && <p className="aol-loading">Loading...</p>}

      {!loading && pageOrders.length === 0 && (
        <p className="aol-empty">No orders found</p>
      )}

      {!loading && pageOrders.length > 0 && (
        <>
          <table className="aol-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
<tbody>
  {pageOrders.map((o) => (
    <tr key={o._id}>
      <td>{o.customerName}</td>

      <td>
        {o.email}
        <br />
        +91 {o.mobile}
      </td>

      <td>
        <div>
          {o.address?.fullAddress}
          <br />
          <small>
            {o.address?.city}, {o.address?.state} –{" "}
            {o.address?.pincode}
          </small>
        </div>
      </td>

      <td>₹{o.totalAmount}</td>

      <td>
        <span
          className={`aol-status aol-status--${o.status}`}
        >
          {o.status}
        </span>
      </td>

      <td>
        <select
          value={o.status}
          disabled={
            updatingId === o._id ||
            o.status === "delivered"
          }
          onChange={(e) =>
            updateStatus(o._id, e.target.value)
          }
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="out_for_delivery">
            Out for Delivery
          </option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {/* 🔢 PAGINATION UI */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={safePage === 1}
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={
                    safePage === i + 1 ? "active" : ""
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;