import React, { useState } from 'react';
import { useTheme } from '../context/ThemeProvider';
import './Settings.css';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-item">
          <label>Theme</label>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <label>Email Notifications</label>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleNotificationChange('email')}
          />
        </div>
        <div className="setting-item">
          <label>Push Notifications</label>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
          />
        </div>
        <div className="setting-item">
          <label>Marketing Emails</label>
          <input
            type="checkbox"
            checked={notifications.marketing}
            onChange={() => handleNotificationChange('marketing')}
          />
        </div>
      </section>

      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="setting-item">
          <label>Currency</label>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="settings-select"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Language</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="settings-select"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default Settings; 