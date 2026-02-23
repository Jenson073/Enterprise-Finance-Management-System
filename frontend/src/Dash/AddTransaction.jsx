import { useState } from "react";

function AddTransaction({ addPayment }) {
  const [transactiondata, setTransactiondata] = useState({
    amt: "",
    due: "",
    category: "",
    description: "",
    file: null
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!e.target.checkValidity()) return;

    addPayment({
      ...transactiondata,
      status: "PENDING",
      created: new Date().toISOString()
    });

    setTransactiondata({
      amt: "",
      due: "",
      category: "",
      description: "",
      file: null
    });
    const notification = document.createElement('div');
      notification.className = 'alert alert-success';
      notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; animation: slideIn 0.3s ease-out';
      notification.innerHTML = '<strong>✅ Success!</strong> Transaction added successfully.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

    e.target.reset();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, CSV, JPG, PNG files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setTransactiondata({ ...transactiondata, file });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="mb-4">Add Transaction</h4>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              required
              min="1"
              value={transactiondata.amt}
              onChange={(e) =>
                setTransactiondata({ ...transactiondata, amt: e.target.value })
              }
            />
          </div>

          {/* Due Date */}
          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input
              type="datetime-local"
              className="form-control"
              required
              value={transactiondata.due}
              onChange={(e) =>
                setTransactiondata({ ...transactiondata, due: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              required
              value={transactiondata.category}
              onChange={(e) =>
                setTransactiondata({
                  ...transactiondata,
                  category: e.target.value
                })
              }
            >
              <option value="">Select Category</option>
              <option value="Salary">EMPLOYEE SALARY</option>
              <option value="Tax">TAX</option>
              <option value="Invoice">INVOICE</option>
              <option value="Office Supplies">OFFICE SUPPLIES</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              required
              minLength={5}
              rows={3}
              value={transactiondata.description}
              onChange={(e) =>
                setTransactiondata({
                  ...transactiondata,
                  description: e.target.value
                })
              }
            />
          </div>

          {/* File Upload */}
          <div className="mb-2">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.csv,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <small className="text-muted">
              Allowed formats: PDF, CSV, JPG, PNG · Max size: 5MB
            </small>

            {transactiondata.file && (
              <div className="mt-1 text-success">
                Selected: {transactiondata.file.name}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className="btn btn-success mt-4"
            type="submit"
            disabled={
              !transactiondata.amt ||
              !transactiondata.due ||
              !transactiondata.category ||
              !transactiondata.description
            }
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
