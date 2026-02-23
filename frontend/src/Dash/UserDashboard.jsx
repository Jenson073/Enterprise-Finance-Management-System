import { useEffect, useState } from "react";
import { api } from "../Dash/TransactionApi";

function UserDashboard() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/completed")
      .then(res => setPayments(res.data))
      .catch(() => setError("Unable to load completed transactions"));
  }, []);

  const totalAmount = payments.reduce((sum, p) => sum + p.amt, 0);

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        <h4 className="mb-3 text-success">✔ Completed Transactions</h4>

        {/* Summary Section */}
        <div className="mb-4 p-3 rounded bg-light border">
          <div className="d-flex justify-content-between">
            <div>
              <small className="text-muted">Total Completed</small>
              <h5 className="mb-0 text-success">{payments.length}</h5>
            </div>
            <div>
              <small className="text-muted">Total Amount</small>
              <h5 className="mb-0 text-success">₹ {totalAmount}</h5>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {payments.length === 0 && !error && (
          <p className="text-muted">No completed transactions found.</p>
        )}

        {payments.map(payment => (
          <div
            key={payment.id}
            className="alert alert-success d-flex justify-content-between align-items-center"
          >
            <div>
              <h6 className="mb-1">{payment.category}</h6>
              <small className="text-muted d-block">
                {payment.description}
              </small>
              <small className="text-muted">
                📅 {new Date(payment.created).toLocaleString()}
              </small>
            </div>

            <div className="text-end">
              <span className="badge bg-success mb-2">
                COMPLETED
              </span>
              <div className="fw-bold text-success">
                ₹ {payment.amt}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default UserDashboard;
