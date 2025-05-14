import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Insights from './pages/Insights';
import Recommendations from './pages/Recommendations';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import HelpSupport from './pages/HelpSupport';
import BudgetSimulator from './pages/BudgetSimulator';
import Login from './pages/Login';
import Register from './pages/Register';
import { FinanceProvider } from './context/FinanceContext';
import ThemeProvider from './context/ThemeProvider';
import TransactionProvider from './context/TransactionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <TransactionProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="insights" element={<Insights />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="help-support" element={<HelpSupport />} />
                <Route path="simulator" element={<BudgetSimulator />} />
              </Route>
            </Routes>
          </Router>
        </TransactionProvider>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;