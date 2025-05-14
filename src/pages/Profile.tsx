import React, { useState } from 'react';
import { User, Mail, CreditCard, Lock, Save, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useFinance();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    risk_tolerance: user?.risk_tolerance || 'medium',
    spending_habits: user?.spending_habits || 'medium',
    income_range: user?.income_range || '$50,000 - $100,000',
    savings_goal: user?.savings_goal || 'Retirement'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await updateUserProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account and financial preferences</p>
      </div>
      
      <div className="profile-grid">
        <div className="profile-section user-info">
          <h2>Account Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : saveSuccess ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
        
        <div className="profile-section financial-preferences">
          <h2>Financial Preferences</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="risk_tolerance">Risk Tolerance</label>
              <select
                id="risk_tolerance"
                name="risk_tolerance"
                value={formData.risk_tolerance}
                onChange={handleChange}
              >
                <option value="low">Low - I prefer safety over high returns</option>
                <option value="medium">Medium - I can accept some volatility</option>
                <option value="high">High - I can tolerate significant fluctuations</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="spending_habits">Spending Habits</label>
              <select
                id="spending_habits"
                name="spending_habits"
                value={formData.spending_habits}
                onChange={handleChange}
              >
                <option value="low">Low - I'm very frugal</option>
                <option value="medium">Medium - I balance saving and spending</option>
                <option value="high">High - I enjoy spending on experiences and items</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="income_range">Income Range</label>
              <select
                id="income_range"
                name="income_range"
                value={formData.income_range}
                onChange={handleChange}
              >
                <option value="Under $30,000">Under $30,000</option>
                <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000 - $200,000">$100,000 - $200,000</option>
                <option value="Over $200,000">Over $200,000</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="savings_goal">Primary Savings Goal</label>
              <select
                id="savings_goal"
                name="savings_goal"
                value={formData.savings_goal}
                onChange={handleChange}
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Home Purchase">Home Purchase</option>
                <option value="Retirement">Retirement</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : saveSuccess ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
        
        <div className="profile-section security-settings">
          <h2>Security and Integrations</h2>
          
          <div className="security-card">
            <div className="security-card-header">
              <Lock size={20} />
              <h3>Password</h3>
            </div>
            <p>Secure your account with a strong password.</p>
            <button className="outline-button">Change Password</button>
          </div>
          
          <div className="security-card">
            <div className="security-card-header">
              <CreditCard size={20} />
              <h3>Connect Bank Accounts</h3>
            </div>
            <p>Link your financial accounts for better insights.</p>
            <button className="outline-button">Connect Accounts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;