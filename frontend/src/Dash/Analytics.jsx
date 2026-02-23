import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#667eea", "#48bb78", "#f56565", "#ed8936"];

function Analytics({ payments }) {
  // ---------- METRICS ----------
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amt || 0), 0);
  const avgAmount = payments.length ? (totalAmount / payments.length).toFixed(2) : 0;

  // ---------- MONTHLY DATA ----------
  const monthlyMap = {};
  payments.forEach(p => {
    const date = new Date(p.due);
    const key = date.toLocaleString("en-IN", { month: "short", year: "numeric" });
    monthlyMap[key] = (monthlyMap[key] || 0) + Number(p.amt || 0);
  });

  const monthlyData = Object.keys(monthlyMap).map(month => ({
    month,
    amount: monthlyMap[month]
  }));

  // ---------- CATEGORY DATA ----------
  const categoryMap = {};
  payments.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + Number(p.amt || 0);
  });

  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  // ---------- STATUS DATA ----------
  const statusMap = {};
  payments.forEach(p => {
    statusMap[p.status] = (statusMap[p.status] || 0) + 1;
  });

  const statusData = Object.keys(statusMap).map(status => ({
    name: status,
    value: statusMap[status]
  }));

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '12px 16px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>{label}</p>
          <p style={{ margin: '4px 0 0 0', color: '#667eea', fontWeight: 700 }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid fade-in">
      {/* METRIC CARDS */}
      <div className="row mb-4">
        <Metric 
          title="Total Transactions" 
          value={payments.length} 
          icon="📝"
          color="#667eea"
        />
        <Metric 
          title="Total Amount" 
          value={`₹${totalAmount.toLocaleString('en-IN')}`} 
          icon="💰"
          color="#48bb78"
        />
        <Metric 
          title="Average / Transaction" 
          value={`₹${Number(avgAmount).toLocaleString('en-IN')}`} 
          icon="📊"
          color="#ed8936"
        />
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h5 className="text-muted">No transaction data available</h5>
          <p className="text-muted">Add your first transaction to see analytics</p>
        </div>
      ) : (
        <div className="row">
          {/* MONTHLY BAR */}
          <div className="col-lg-6 mb-4">
            <ChartCard title="📈 Monthly Spend Trend">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#718096', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#718096', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#colorGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* CATEGORY PIE */}
          <div className="col-lg-6 mb-4">
            <ChartCard title="🎯 Category Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    dataKey="value" 
                    nameKey="name" 
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* STATUS DONUT */}
          <div className="col-lg-6 mb-4">
            <ChartCard title="✅ Status Overview">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ title, value, icon, color }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm text-center">
        <div className="card-body">
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{icon}</div>
          <h6 className="text-muted">{title}</h6>
          <h4 style={{ color: color }}>{value}</h4>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="mb-3" style={{ fontWeight: 700, fontSize: '16px' }}>{title}</h6>
        {children}
      </div>
    </div>
  );
}

export default Analytics;