import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Notifications.css';

const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useFinance();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter notifications based on selected tab and filter
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Filter by read status
    if (selectedTab === 'unread') {
      filtered = filtered.filter(notification => !notification.read);
    } else if (selectedTab === 'read') {
      filtered = filtered.filter(notification => notification.read);
    }
    
    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedFilter);
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return <AlertTriangle size={18} className="notification-icon alert" />;
      case 'insight':
        return <Info size={18} className="notification-icon insight" />;
      case 'success':
        return <CheckCircle size={18} className="notification-icon success" />;
      default:
        return <Bell size={18} className="notification-icon" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with your financial alerts and insights</p>
      </div>
      
      <div className="notifications-content">
        <div className="notifications-filters">
          <div className="tabs">
            <button 
              className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              All
            </button>
            <button 
              className={`tab ${selectedTab === 'unread' ? 'active' : ''}`}
              onClick={() => setSelectedTab('unread')}
            >
              Unread
            </button>
            <button 
              className={`tab ${selectedTab === 'read' ? 'active' : ''}`}
              onClick={() => setSelectedTab('read')}
            >
              Read
            </button>
          </div>
          
          <div className="type-filter">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="alert">Alerts</option>
              <option value="insight">Insights</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
        
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markNotificationAsRead(notification.id)}
              >
                <div className="notification-content">
                  {getNotificationIcon(notification.type)}
                  <div className="notification-text">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatDate(notification.date)}</span>
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="mark-read-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(notification.id);
                      }}
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button className="delete-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Bell size={40} />
              <h3>No notifications</h3>
              <p>You don't have any {selectedTab !== 'all' ? selectedTab + ' ' : ''}notifications{selectedFilter !== 'all' ? ' of type ' + selectedFilter : ''}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;