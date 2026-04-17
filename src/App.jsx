import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [message, setMessage] = useState('');
  const [subscribedEmails, setSubscribedEmails] = useState([]);

  useEffect(() => {
    // Load previously subscribed emails from localStorage
    const saved = localStorage.getItem('subscribedEmails');
    if (saved) {
      setSubscribedEmails(JSON.parse(saved));
    }
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Reset status
    setStatus(null);
    setMessage('');

    const trimmedEmail = email.trim();

    // Prevent empty submissions
    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Email cannot be empty');
      return;
    }

    // Basic validation: must contain '@' and '.'
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setStatus('error');
      setMessage('Enter valid email');
      return;
    }

    // Advanced but simple structural check (optional but good practice)
    const atIndex = trimmedEmail.indexOf('@');
    const dotIndex = trimmedEmail.lastIndexOf('.');
    if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= trimmedEmail.length) {
      setStatus('error');
      setMessage('Enter valid email');
      return;
    }

    // Check for duplicates
    if (subscribedEmails.includes(trimmedEmail)) {
      setStatus('error');
      setMessage('Email is already subscribed');
      return;
    }

    // Success case
    const updatedEmails = [...subscribedEmails, trimmedEmail];
    setSubscribedEmails(updatedEmails);
    localStorage.setItem('subscribedEmails', JSON.stringify(updatedEmails));

    setStatus('success');
    setMessage('Subscribed successfully');
    setEmail(''); // Clear input

    // Clear success message after 5 seconds
    setTimeout(() => {
      setStatus(null);
      setMessage('');
    }, 5000);
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <div className="card-header">
          <h2>Stay Updated!</h2>
          <p>Join our newsletter and never miss an update.</p>
        </div>

        <form onSubmit={handleSubscribe} className="subscription-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus(null);
                  setMessage('');
                }
              }}
              className={status === 'error' ? 'input-error' : status === 'success' ? 'input-success' : ''}
              aria-label="Email Address"
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </div>

          {message && (
            <div className={`message-box ${status}`}>
              {status === 'success' ? (
                <span className="icon">✓</span>
              ) : (
                <span className="icon">⚠</span>
              )}
              {message}
            </div>
          )}
        </form>

        <div className="privacy-note">
          <p>We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
