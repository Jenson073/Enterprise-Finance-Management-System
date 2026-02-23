import { useNavigate } from "react-router-dom";
import { logout } from "../Dash/TransactionApi";

function Sidebar({ setmodule, currentModule }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/user");
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'pending', label: 'Pending Transactions', icon: '⏳' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'addtransaction', label: 'Add Transaction', icon: '➕' },
    { id: 'manageall', label: 'Manage All', icon: '📋' },
    { id: 'createuser', label: 'Create User', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <h5 className="text-white mb-4">Enterprise Portal</h5>

      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li 
            key={item.id}
            className="nav-item" 
            onClick={() => setmodule(item.id)}
          >
            <span className={`nav-link ${currentModule === item.id ? 'active' : ''}`}>
              <span className="me-2">{item.icon}</span>
              {item.label}
            </span>
          </li>
        ))}
        
        <li className="nav-item mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span 
            className={`nav-link ${currentModule === 'changepassword' ? 'active' : ''}`}
            onClick={() => setmodule("changepassword")}
          >
            <span className="me-2">🔒</span>
            Change Password
          </span>
        </li>

        <li className="nav-item mt-2">
          <span
            className="nav-link text-danger"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <span className="me-2">🚪</span>
            Logout
          </span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;