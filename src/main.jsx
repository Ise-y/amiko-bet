import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

export default function AmikoBet() {
  const [screen, setScreen] = useState('landing');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('amikousers');
    return saved ? JSON.parse(saved) : {
      '0911111111': { phone: '0911111111', password: 'demo123', balance: 5000, name: 'Demo User', kyc: true },
    };
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('agent1');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('amikoTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save data
  useEffect(() => {
    localStorage.setItem('amikousers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('amikoTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const agents = {
    agent1: { name: 'Agent 1', telebirr: '0912345678', commission: '5%' },
    agent2: { name: 'Agent 2', telebirr: '0923456789', commission: '3%' },
  };

  const handleRegister = () => {
    if (!phone || !password) {
      setMessage('Please fill all fields');
      return;
    }
    if (users[phone]) {
      setMessage('User already exists');
      return;
    }
    setUsers({
      ...users,
      [phone]: { phone, password, balance: 0, name: 'User', kyc: false }
    });
    setMessage('Registration successful! Please login.');
    setScreen('login');
  };

  const handleLogin = () => {
    if (!phone || !password) {
      setMessage('Please fill all fields');
      return;
    }
    const user = users[phone];
    if (!user || user.password !== password) {
      setMessage('Invalid credentials');
      return;
    }
    setCurrentUser(user);
    setScreen('dashboard');
    setMessage('');
  };

  const handleDeposit = () => {
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      setMessage('Enter valid amount');
      return;
    }
    const amount = Number(depositAmount);
    const updatedUser = { ...currentUser, balance: currentUser.balance + amount };
    setUsers({ ...users, [currentUser.phone]: updatedUser });
    setCurrentUser(updatedUser);
    setTransactions([...transactions, {
      id: Date.now(),
      amount: amount,
      type: 'deposit',
      status: 'completed',
      date: new Date().toISOString()
    }]);
    setDepositAmount('');
    setMessage(`Deposited ${amount} ETB successfully!`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      setMessage('Enter valid amount');
      return;
    }
    const amount = Number(withdrawAmount);
    if (amount > currentUser.balance) {
      setMessage('Insufficient balance');
      return;
    }
    setTransactions([...transactions, {
      id: Date.now(),
      amount: amount,
      type: 'withdrawal',
      status: 'pending',
      date: new Date().toISOString()
    }]);
    setWithdrawAmount('');
    setMessage(`Withdrawal request of ${amount} ETB submitted for approval`);
  };

  const handleAdminLogin = () => {
    if (adminPass === 'admin123') {
      setAdminLoggedIn(true);
      setMessage('Admin logged in');
    } else {
      setMessage('Invalid admin password');
    }
    setAdminPass('');
  };

  const handleApproveWithdrawal = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users[transaction.userPhone || currentUser?.phone];
    if (user && user.balance >= transaction.amount) {
      const updatedUser = { ...user, balance: user.balance - transaction.amount };
      setUsers({ ...users, [user.phone]: updatedUser });
      setTransactions(transactions.map(t => 
        t.id === transactionId ? { ...t, status: 'approved' } : t
      ));
      setMessage('Withdrawal approved');
    } else {
      setMessage('Insufficient balance');
    }
  };

  const handleRejectWithdrawal = (transactionId) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'rejected' } : t
    ));
    setMessage('Withdrawal rejected');
  };

  const Logout = () => {
    setCurrentUser(null);
    setScreen('landing');
    setAdminLoggedIn(false);
    setMessage('');
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0F1E 0%, #1a1a2e 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '500px',
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    title: {
      textAlign: 'center',
      fontSize: '2.5em',
      marginBottom: '10px',
      background: 'linear-gradient(45deg, #00BFFF, #00E5FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s'
    },
    button: {
      width: '100%',
      padding: '14px',
      margin: '10px 0',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #00BFFF, #00E5FF)',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 0 20px rgba(0,191,255,0.3)'
      }
    },
    buttonSecondary: {
      width: '100%',
      padding: '14px',
      margin: '10px 0',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'transparent',
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    message: {
      padding: '10px',
      borderRadius: '10px',
      margin: '10px 0',
      textAlign: 'center',
      background: 'rgba(0,191,255,0.1)',
      border: '1px solid rgba(0,191,255,0.2)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      margin: '20px 0'
    },
    gameCard: {
      background: 'rgba(255,255,255,0.05)',
      padding: '20px',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  };

  // Render landing/login/register
  if (screen === 'landing' || screen === 'login' || screen === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎯 AMIKO BET</h1>
          <p style={{textAlign: 'center', opacity: 0.7, marginBottom: '20px'}}>
            {screen === 'landing' ? 'Welcome! Login or Register' : 
             screen === 'login' ? 'Login to your account' : 'Create new account'}
          </p>
          
          {message && <div style={styles.message}>{message}</div>}
          
          <input
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />
          <input
            style={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          
          {screen === 'landing' && (
            <>
              <button style={styles.button} onClick={() => setScreen('login')}>
                Login
              </button>
              <button style={styles.buttonSecondary} onClick={() => setScreen('register')}>
                Register
              </button>
              <button style={styles.buttonSecondary} onClick={() => setScreen('admin')}>
                Admin Login
              </button>
            </>
          )}
          
          {screen === 'login' && (
            <>
              <button style={styles.button} onClick={handleLogin}>
                Login
              </button>
              <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
                Back
              </button>
            </>
          )}
          
          {screen === 'register' && (
            <>
              <button style={styles.button} onClick={handleRegister}>
                Register
              </button>
              <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
                Back
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Admin panel
  if (screen === 'admin' || adminLoggedIn) {
    if (!adminLoggedIn) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>🔐 Admin Login</h1>
            {message && <div style={styles.message}>{message}</div>}
            <input
              style={styles.input}
              placeholder="Admin Password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              type="password"
            />
            <button style={styles.button} onClick={handleAdminLogin}>
              Login as Admin
            </button>
            <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
              Back
            </button>
          </div>
        </div>
      );
    }

    const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const totalUsers = Object.keys(users).length;
    const totalTransactions = transactions.length;

    return (
      <div style={styles.container}>
        <div style={{...styles.card, maxWidth: '800px'}}>
          <h1 style={styles.title}>👑 Admin Dashboard</h1>
          
          <div style={styles.grid}>
            <div style={styles.gameCard}>
              <h3>👤 Users</h3>
              <p style={{fontSize: '2em'}}>{totalUsers}</p>
            </div>
            <div style={styles.gameCard}>
              <h3>💰 Transactions</h3>
              <p style={{fontSize: '2em'}}>{totalTransactions}</p>
            </div>
            <div style={styles.gameCard}>
              <h3>⏳ Pending</h3>
              <p style={{fontSize: '2em'}}>{pendingWithdrawals.length}</p>
            </div>
          </div>

          {message && <div style={styles.message}>{message}</div>}

          <h3>📊 All Users</h3>
          {Object.values(users).map((user, i) => (
            <div key={i} style={{...styles.gameCard, margin: '10px 0'}}>
              <p><strong>{user.name}</strong> - 📱 {user.phone}</p>
              <p>💰 Balance: {user.balance} ETB</p>
            </div>
          ))}

          <h3>📋 Pending Withdrawals</h3>
          {pendingWithdrawals.length === 0 ? (
            <p>No pending withdrawals</p>
          ) : (
            pendingWithdrawals.map((t, i) => (
              <div key={i} style={{...styles.gameCard, margin: '10px 0'}}>
                <p>Amount: {t.amount} ETB</p>
                <p>Date: {new Date(t.date).toLocaleDateString()}</p>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button style={{...styles.button, flex: 1}} onClick={() => handleApproveWithdrawal(t.id)}>
                    ✅ Approve
                  </button>
                  <button style={{...styles.buttonSecondary, flex: 1}} onClick={() => handleRejectWithdrawal(t.id)}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <button style={styles.buttonSecondary} onClick={Logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // User dashboard
  if (screen === 'dashboard' && currentUser) {
    const userTransactions = transactions.filter(t => t.userPhone === currentUser.phone);
    const pendingWithdrawals = userTransactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

    return (
      <div style={styles.container}>
        <div style={{...styles.card, maxWidth: '800px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={styles.title}>🎯 AMIKO BET</h1>
            <button style={{...styles.buttonSecondary, width: 'auto', padding: '10px 20px'}} onClick={Logout}>
              Logout
            </button>
          </div>
          
          <div style={{textAlign: 'center', margin: '20px 0'}}>
            <p>👤 {currentUser.name || 'User'}</p>
            <p>📱 {currentUser.phone}</p>
            <h2 style={{fontSize: '3em', color: '#00E5FF'}}>💰 {currentUser.balance} ETB</h2>
          </div>

          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.grid}>
            <div style={styles.gameCard}>
              <h3>💳 Deposit</h3>
              <input
                style={styles.input}
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                type="number"
              />
              <button style={styles.button} onClick={handleDeposit}>
                Deposit via Agent
              </button>
              <p style={{fontSize: '12px', opacity: 0.7, marginTop: '10px'}}>
                Agent: {agents[selectedAgent]?.name} | 📱 {agents[selectedAgent]?.telebirr}
              </p>
            </div>

            <div style={styles.gameCard}>
              <h3>💸 Withdraw</h3>
              <input
                style={styles.input}
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                type="number"
              />
              <button style={styles.button} onClick={handleWithdraw}>
                Request Withdrawal
              </button>
              {pendingWithdrawals.length > 0 && (
                <p style={{fontSize: '12px', color: '#FFA500'}}>
                  ⏳ {pendingWithdrawals.length} pending withdrawal(s)
                </p>
              )}
            </div>
          </div>

          <h3>🎮 Play Games</h3>
          <div style={styles.grid}>
            <div style={styles.gameCard}>
              <h4>✈️ Aviator</h4>
              <button style={styles.button}>Play Now</button>
            </div>
            <div style={styles.gameCard}>
              <h4>🚀 JetX</h4>
              <button style={styles.button}>Play Now</button>
            </div>
            <div style={styles.gameCard}>
              <h4>⚽ Football</h4>
              <button style={styles.button}>Play Now</button>
            </div>
          </div>

          <h3>📜 Recent Transactions</h3>
          {userTransactions.slice(-5).reverse().map((t, i) => (
            <div key={i} style={{...styles.gameCard, margin: '5px 0'}}>
              <p>
                {t.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'} - 
                {t.amount} ETB - 
                <span style={{color: t.status === 'pending' ? '#FFA500' : t.status === 'approved' ? '#00FF00' : '#FF0000'}}>
                  {t.status}
                </span>
              </p>
            </div>
          ))}

          <button style={styles.buttonSecondary} onClick={() => setScreen('admin')}>
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<AmikoBet />);
