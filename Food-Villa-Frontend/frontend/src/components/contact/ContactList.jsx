import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/index.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contact");
      setContacts(res.data);
    } catch (error) {
      console.error("Fetch contacts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await API.delete(`/contact/${id}`);
    fetchContacts();
  };

  /* EMPTY STATE */
  if (!loading && contacts.length === 0) {
    return (
      <div className="acl-empty">
        <h3>No contact messages</h3>
        <p>No one has contacted yet.</p>
      </div>
    );
  }

  return (
    <div className="acl-list">
      {loading && (
        <p className="acl-loading-text">Loading contacts...</p>
      )}

      {!loading &&
        contacts.map((c) => (
          <div key={c._id} className="acl-card">
            <div className="acl-info">
              <h4 className="acl-name">{c.name}</h4>
              <p>
                <strong>Email:</strong> {c.email}
              </p>
              <p>
                <strong>Mobile:</strong> {c.mobile}
              </p>
              <p className="acl-message">{c.message}</p>
            </div>

            <button
              className="acl-delete-btn"
              onClick={() => handleDelete(c._id)}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default ContactList;
