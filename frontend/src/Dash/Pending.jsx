function Pending({ payments }) {
  const pendingPayments = payments.filter(
    payment => payment.status === "PENDING"
  );

  // Sort by due date (earliest first)
  const sortedPending = pendingPayments.sort((a, b) => 
    new Date(a.due) - new Date(b.due)
  );

  // Check if payment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="fade-in">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Summary Stats */}
      {pendingPayments.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm" style={{ 
              background: 'linear-gradient(135deg, #feebc8 0%, #fbd38d 100%)',
              border: 'none'
            }}>
              <div className="card-body text-center">
                <h6 className="mb-2" style={{ color: '#7c2d12', fontWeight: 700 }}>
                  Total Pending Amount
                </h6>
                <h3 style={{ color: '#7c2d12', fontWeight: 800 }}>
                  ₹{pendingPayments.reduce((sum, p) => sum + Number(p.amt), 0).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card shadow-sm" style={{ 
              background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
              border: 'none'
            }}>
              <div className="card-body text-center">
                <h6 className="mb-2" style={{ color: '#742a2a', fontWeight: 700 }}>
                  Overdue Transactions
                </h6>
                <h3 style={{ color: '#742a2a', fontWeight: 800 }}>
                  {pendingPayments.filter(p => isOverdue(p.due)).length}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">⏳ Pending Transactions</h4>
            <span className="badge bg-warning text-dark" style={{ fontSize: '14px', padding: '8px 16px' }}>
              {pendingPayments.length} Pending
            </span>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h5 className="text-muted">All caught up!</h5>
              <p className="text-muted">No pending transactions at the moment</p>
            </div>
          ) : (
            <ul className="list-group">
              {sortedPending.map((payment, index) => (
                <li 
                  key={payment.id} 
                  className="list-group-item"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animation: 'slideIn 0.3s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <strong style={{ fontSize: '1.35rem', color: '#1a202c' }}>
                          ₹{Number(payment.amt).toLocaleString('en-IN')}
                        </strong>
                        {isOverdue(payment.due) && (
                          <span className="badge bg-danger" style={{ fontSize: '11px' }}>
                            OVERDUE
                          </span>
                        )}
                      </div>
                      
                      <div className="d-flex gap-2 align-items-center text-muted small mb-1">
                        <span style={{ fontWeight: 600, color: '#4a5568' }}>
                          📁 {payment.category}
                        </span>
                        <span style={{ color: '#cbd5e0' }}>•</span>
                        <span>{payment.description}</span>
                      </div>

                      <div className="small mt-2" style={{ 
                        color: isOverdue(payment.due) ? '#e53e3e' : '#718096',
                        fontWeight: 500
                      }}>
                        <span style={{ marginRight: '4px' }}>
                          {isOverdue(payment.due) ? '⚠️' : '📅'}
                        </span>
                        Due: {new Date(payment.due).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>

                    <span className="badge bg-warning text-dark align-self-center">
                      Pending
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pending;