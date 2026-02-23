function Alerts({ payments }) {

  const now = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setDate(now.getDate() + 30);

  const alertPayments = payments.filter(payment => {
    const dueDate = new Date(payment.due);

    return (
      payment.status === "PENDING" &&
      dueDate >= now &&
      dueDate <= oneMonthFromNow
    );
  });

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="mb-4">Alerts</h4>

        {alertPayments.length === 0 && (
          <p className="text-muted">No upcoming alerts</p>
        )}

        {alertPayments.map(payment => (
          <div key={payment.id} className="alert alert-danger">
            <h6 className="mb-1">{payment.category}</h6>
            <small>
              <span style={{ marginRight: '4px' }}>
                          {'📅'}
                        </span>
              Due on: {new Date(payment.due).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;