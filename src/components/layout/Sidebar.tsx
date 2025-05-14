import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  LineChart, 
  Lightbulb, 
  Bell, 
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Search,
  Star,
  Calculator,
  Receipt
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { logout } = useFinance();
  
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="logo">
            <TrendingUp size={28} className="logo-icon" />
            <span className="logo-text">FINTRACK</span>
          </div>
        ) : (
          <div className="logo-small">
            <TrendingUp size={28} />
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
              <LayoutDashboard size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className={({isActive}) => isActive ? 'active' : ''}>
              <Receipt size={20} />
              {!collapsed && <span>Transactions</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>
              <User size={20} />
              {!collapsed && <span>Profile</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/insights" className={({isActive}) => isActive ? 'active' : ''}>
              <LineChart size={20} />
              {!collapsed && <span>Insights</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/recommendations" className={({isActive}) => isActive ? 'active' : ''}>
              <Lightbulb size={20} />
              {!collapsed && <span>Recommendations</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({isActive}) => isActive ? 'active' : ''}>
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-section">
        {!collapsed && <h3 className="sidebar-section-title">Tools</h3>}
        <ul>
          <li>
            <NavLink to="/market-search" className={({isActive}) => isActive ? 'active' : ''}>
              <Search size={20} />
              {!collapsed && <span>Market Search</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/watchlist" className={({isActive}) => isActive ? 'active' : ''}>
              <Star size={20} />
              {!collapsed && <span>Watchlist</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/simulator" className={({isActive}) => isActive ? 'active' : ''}>
              <Calculator size={20} />
              {!collapsed && <span>Budget Simulator</span>}
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <ul>
          <li>
            <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </li>
          <li>
          <NavLink to="/help-support" className={({isActive}) => isActive ? 'active' : ''}>
              <HelpCircle size={20} />
              {!collapsed && <span>Help & Support</span>}
            </NavLink>
          </li>
          <li>
            <button className="logout-button" onClick={logout}>
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;