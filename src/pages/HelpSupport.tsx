import React, { useState } from 'react';
import './HelpSupport.css';

const HelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password."
    },
    {
      question: "How can I update my profile information?",
      answer: "You can update your profile information by going to the Profile page and clicking on the 'Edit Profile' button. Make your changes and save them."
    },
    {
      question: "How do I view my transaction history?",
      answer: "You can view your transaction history by navigating to the Transactions page. All your past transactions will be listed there with detailed information."
    },
    {
      question: "What payment methods are supported?",
      answer: "We currently support credit/debit cards, bank transfers, and digital wallets. You can add or manage payment methods in the Settings page."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Support form submitted:', supportForm);
    // Reset form
    setSupportForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="help-support-container">
      <h1>Help & Support</h1>
      
      <div className="help-support-tabs">
        <button 
          className={`help-support-tab ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQs
        </button>
        <button 
          className={`help-support-tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Us
        </button>
        <button 
          className={`help-support-tab ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support Form
        </button>
      </div>

      <div className="help-support-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Email:</strong> support@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              <p><strong>Address:</strong> 123 Support Street, Help City, HC 12345</p>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="support-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={supportForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={supportForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={supportForm.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                />
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport; 