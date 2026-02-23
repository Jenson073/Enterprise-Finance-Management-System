 import { useEffect, useState } from "react";
import Sidebar from "../Dash/Sidebar.jsx";
import Pending from "../Dash/Pending.jsx";
import Alerts from "../Dash/Alerts.jsx";
import AddTransaction from "../Dash/AddTransaction.jsx";
import ManageAll from "../Dash/ManageAll.jsx";
import Analytics from "../Dash/Analytics.jsx";
import ChangePassword from "../Dash/ChangePassword.jsx";
import CreateUser from "../Dash/CreateUser.jsx";
import { getTransactions,addTransaction } from "../Dash/TransactionApi.jsx";
function Dashboard() {
  const [module, setModule] = useState('analytics');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadpayments();
  }, []);
  const loadpayments = async () => {
    try{const data = await getTransactions();
    setPayments(data);}
    catch(err){console.log("Error fetching transactions:",err);}
  };
  const addPayments = async (payment) => {
    try{const newPayment = await addTransaction(payment);
    setPayments(prevPayments => [...prevPayments, newPayment]);}
    catch(err){console.log("Error adding transaction:",err);}
  };

  const displayModule = () => {
    switch (module) {
      case 'pending':
        return <Pending payments={payments} />;
      case 'alerts':
        return <Alerts payments={payments}/>;
      case 'addtransaction':
        return <AddTransaction payments={payments} addPayment={addPayments} />;
      case 'manageall':
        return <ManageAll payments={payments} setPayments={setPayments}/>;
      case 'analytics':
        return <Analytics payments={payments} />;
      case 'changepassword':
        return <ChangePassword />;
      case 'createuser':
        return <CreateUser />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar setmodule={setModule} />

      <div className="dashboard-content">
        <h4 className="mb-4">Enterprise Dashboard</h4>
        {displayModule()}
      </div>
    </div>
  );
}

export default Dashboard;
