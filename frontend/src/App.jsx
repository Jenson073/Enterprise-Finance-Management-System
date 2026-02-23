import './App.css'
import UserDashboard from './Dash/UserDashboard.jsx';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './Router/PrivateRouter.jsx';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path='/' element={<Login />} />

        {/* ADMIN */}
        <Route element={<PrivateRoute allowedRole="admin" />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        {/* USER */}
        <Route element={<PrivateRoute allowedRole="user" />}>
          <Route path='/user' element={<UserDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
