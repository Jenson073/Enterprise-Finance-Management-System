import { useState, useMemo } from "react";
import { updateTransaction, deleteTransaction, downloadFile } from "./TransactionApi";

function ManageAll({ payments, setPayments }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const statusClass = {
    PENDING: "bg-warning text-dark",
    COMPLETED: "bg-success",
    REVOKED: "bg-danger"
  };

  const startEdit = (payment) => {
    setEditId(payment.id);
    setEditData({ ...payment, file: null });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      const updated = await updateTransaction(editId, editData);
      setPayments(prev =>
        prev.map(p =>
          p.id === editId ? updated : p
        )
      );
      cancelEdit();
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'alert alert-success';
      notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; animation: slideIn 0.3s ease-out';
      notification.innerHTML = '<strong>✅ Success!</strong> Transaction updated';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await deleteTransaction(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'alert alert-success';
      notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; animation: slideIn 0.3s ease-out';
      notification.innerHTML = '<strong>✅ Deleted!</strong> Transaction removed';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Please try again.");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await downloadFile(filename);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "image/jpeg",
      "image/jpg",
      "image/png",
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

    setEditData({ ...editData, file });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setFromDate("");
    setToDate("");
  };

  /* ---------------- FILTER DATA ---------------- */
  const categories = useMemo(() => {
    const unique = new Set(payments.map((p) => p.category));
    return ["ALL", ...unique];
  }, [payments]);

  const statuses = ["ALL", "PENDING", "COMPLETED", "REVOKED"];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amt?.toString().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "ALL" ||
      payment.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "ALL" ||
      payment.status === selectedStatus;

    const createdDate = new Date(payment.created);
    const matchesFromDate =
      !fromDate || createdDate >= new Date(fromDate);
    const matchesToDate =
      !toDate || createdDate <= new Date(toDate + "T23:59:59");

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const hasActiveFilters = searchTerm || selectedCategory !== "ALL" || 
    selectedStatus !== "ALL" || fromDate || toDate;

  /* ---------------- UI ---------------- */
  return (
    <div className="fade-in">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>📋 All Transactions</span>
          <div className="d-flex gap-2 align-items-center">
            <span className="badge bg-primary">{filteredPayments.length} of {payments.length}</span>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'}
            </button>
          </div>
        </div>
        
        <div className="card-body">
          {/* Filters */}
          {showFilters && (
            <div className="row g-2 mb-3">
              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="🔍 Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st === "ALL" ? "All Status" : st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  placeholder="To Date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="col-md-1">
                {hasActiveFilters && (
                  <button 
                    className="btn btn-secondary w-100"
                    onClick={clearAllFilters}
                    title="Clear all filters"
                  >
                    ✖️
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Created</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <div className="empty-state py-4">
                        <div style={{ fontSize: '3rem', opacity: 0.3 }}>📭</div>
                        <p className="text-muted mb-0">No transactions found</p>
                        {hasActiveFilters && (
                          <button 
                            className="btn btn-sm btn-primary mt-2"
                            onClick={clearAllFilters}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {filteredPayments.map((payment) => (
                  <tr 
                    key={payment.id}
                    style={{
                      background: editId === payment.id 
                        ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))' 
                        : 'transparent',
                      borderLeft: editId === payment.id ? '4px solid #667eea' : 'none'
                    }}
                  >
                    <td style={{ fontWeight: 600 }}>#{payment.id}</td>
                    
                    <td>
                      {editId === payment.id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editData.amt}
                          onChange={(e) =>
                            setEditData({ ...editData, amt: e.target.value })
                          }
                        />
                      ) : (
                        <strong style={{ color: '#1a202c' }}>₹{Number(payment.amt).toLocaleString('en-IN')}</strong>
                      )}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm"
                          value={editData.due?.slice(0, 16) || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, due: e.target.value })
                          }
                        />
                      ) : (
                        new Date(payment.due).toLocaleDateString("en-IN", {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      )}
                    </td>
                    
                    <td style={{ fontSize: '13px', color: '#718096' }}>
                      {new Date(payment.created).toLocaleDateString("en-IN", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                        >
                          <option value="Salary">Salary</option>
                          <option value="Tax">Tax</option>
                          <option value="Invoice">Invoice</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Others">Others</option>
                        </select>
                      ) : (
                        <span style={{ 
                          padding: '4px 10px', 
                          background: 'rgba(102, 126, 234, 0.1)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#667eea'
                        }}>
                          {payment.category}
                        </span>
                      )}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <input
                          className="form-control form-control-sm"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({ ...editData, description: e.target.value })
                          }
                        />
                      ) : (
                        <div style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }} title={payment.description}>
                          {payment.description}
                        </div>
                      )}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={editData.status}
                          onChange={(e) =>
                            setEditData({ ...editData, status: e.target.value })
                          }
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="REVOKED">REVOKED</option>
                        </select>
                      ) : (
                        <span className={`badge ${statusClass[payment.status]}`}>
                          {payment.status}
                        </span>
                      )}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          accept=".pdf,.csv,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      ) : payment.fileName ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleDownload(payment.fileName)}
                        >
                          📥 Download
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    
                    <td>
                      {editId === payment.id ? (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={saveEdit}
                            title="Save changes"
                          >
                            ✅
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                            title="Cancel"
                          >
                            ✖️
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => startEdit(payment)}
                            title="Edit transaction"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(payment.id)}
                            title="Delete transaction"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAll;