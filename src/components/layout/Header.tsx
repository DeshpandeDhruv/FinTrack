import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, User, Search, Menu } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './Header.css';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentPath }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { notifications } = useFinance();
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get page title based on current path
  const getPageTitle = () => {
    switch (currentPath) {
      case '/':
        return 'Dashboard';
      case '/profile':
        return 'User Profile';
      case '/insights':
        return 'Financial Insights';
      case '/recommendations':
        return 'Recommendations';
      case '/notifications':
        return 'Notifications';
      default:
        return 'FINTRACK';
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <button 
          className="mobile-menu-button" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      
      <div className="header-center">
        <form className="search-container" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search insights, markets, etc." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="header-right">
        <button 
          className="icon-button notification-button"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>
        
        <button 
          className="icon-button"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        
        <div className="user-menu-container">
          <button 
            className="user-button"
            onClick={toggleUserMenu}
            aria-label="User menu"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="User profile" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                <User size={20} />
              </div>
            )}
            <span className="user-name">{user?.name || 'User'}</span>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <ul>
                <li onClick={() => navigate('/profile')}>My Profile</li>
                <li onClick={() => navigate('/settings')}>Settings</li>
                <li className="divider"></li>
                <li onClick={onLogout}>Sign Out</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button onClick={() => setShowMobileMenu(false)}>×</button>
        </div>
        <ul>
          <li><a href="/" className={currentPath === '/' ? 'active' : ''}>Dashboard</a></li>
          <li><a href="/insights" className={currentPath === '/insights' ? 'active' : ''}>Insights</a></li>
          <li><a href="/recommendations" className={currentPath === '/recommendations' ? 'active' : ''}>Recommendations</a></li>
          <li><a href="/profile" className={currentPath === '/profile' ? 'active' : ''}>Profile</a></li>
          <li><a href="/notifications" className={currentPath === '/notifications' ? 'active' : ''}>Notifications</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;