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
      '0911111111': { phone: '0911111111', password: 'demo123', balance: 5000, name: 'Demo User', kyc: true, role: 'user' },
    };
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('amikoCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [agentLoggedIn, setAgentLoggedIn] = useState(() => {
    const saved = localStorage.getItem('amikoAgentLoggedIn');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    const saved = localStorage.getItem('amikoAdminLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [adminPass, setAdminPass] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('agent1');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('amikoTransactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [agentPhone, setAgentPhone] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [agentWithdrawals, setAgentWithdrawals] = useState([]);
  
  // ===== AGENTS DATA WITH ONLINE STATUS =====
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('amikoAgents');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      agent1: { 
        id: 'agent1', 
        name: 'Abebe', 
        telebirr: '0912345678', 
        commission: '5%',
        phone: '0911000001',
        password: 'agent123',
        online: false
      },
      agent2: { 
        id: 'agent2', 
        name: 'Kebede', 
        telebirr: '0923456789', 
        commission: '3%',
        phone: '0911000002',
        password: 'agent123',
        online: false
      },
      agent3: { 
        id: 'agent3', 
        name: 'Chala', 
        telebirr: '0934567890', 
        commission: '4%',
        phone: '0911000003',
        password: 'agent123',
        online: false
      },
    };
  });

  // ===== CLEAR ALL SESSIONS =====
  const clearAllSessions = () => {
    localStorage.removeItem('amikoCurrentUser');
    localStorage.removeItem('amikoAgentLoggedIn');
    localStorage.removeItem('amikoAdminLoggedIn');
  };

  // ===== SWITCH ACCOUNT =====
  const switchAccount = () => {
    clearAllSessions();
    setCurrentUser(null);
    setAgentLoggedIn(null);
    setAdminLoggedIn(false);
    setScreen('landing');
    setMessage('🔄 Logged out. You can now login with a different account.');
  };

  // ===== AUTO-LOGIN ON PAGE LOAD =====
  useEffect(() => {
    const url = window.location.href;
    if (url.includes('/admin')) {
      setScreen('admin');
      return;
    }
    
    const savedUser = localStorage.getItem('amikoCurrentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (users[user.phone]) {
        setCurrentUser(user);
        setScreen('dashboard');
        return;
      } else {
        clearAllSessions();
      }
    }
    
    const savedAgent = localStorage.getItem('amikoAgentLoggedIn');
    if (savedAgent) {
      const agent = JSON.parse(savedAgent);
      const agentExists = Object.values(agents).some(a => a.phone === agent.phone);
      if (agentExists) {
        setAgentLoggedIn(agent);
        // Set agent online when they login
        setAgentOnline(agent.id, true);
        setScreen('agentDashboard');
        return;
      } else {
        clearAllSessions();
      }
    }
    
    const savedAdmin = localStorage.getItem('amikoAdminLoggedIn');
    if (savedAdmin === 'true') {
      setAdminLoggedIn(true);
      setScreen('admin');
      return;
    }
  }, []);

  // ===== SET AGENT ONLINE/OFFLINE =====
  const setAgentOnline = (agentId, status) => {
    const updatedAgents = { ...agents };
    if (updatedAgents[agentId]) {
      updatedAgents[agentId].online = status;
      setAgents(updatedAgents);
      localStorage.setItem('amikoAgents', JSON.stringify(updatedAgents));
    }
  };

  // ===== GET ONLINE AGENTS =====
  const getOnlineAgents = () => {
    return Object.values(agents).filter(agent => agent.online === true);
  };

  // Save agents data
  useEffect(() => {
    localStorage.setItem('amikoAgents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('amikousers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('amikoTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (agentLoggedIn) {
      const pending = transactions.filter(t => 
        t.type === 'deposit' && 
        t.status === 'pending' && 
        t.agentId === agentLoggedIn.id
      );
      setPendingDeposits(pending);
      
      const withdrawals = transactions.filter(t => 
        t.type === 'withdrawal' && 
        t.status === 'pending' &&
        t.agentId === agentLoggedIn.id
      );
      setAgentWithdrawals(withdrawals);
    }
  }, [transactions, agentLoggedIn]);

  // ==================== CUSTOMER FUNCTIONS ====================

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
      [phone]: { phone, password, balance: 0, name: 'User', kyc: false, role: 'user' }
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
    
    clearAllSessions();
    setCurrentUser(user);
    localStorage.setItem('amikoCurrentUser', JSON.stringify(user));
    setScreen('dashboard');
    setMessage(`Welcome ${user.name || 'User'}!`);
    setPhone('');
    setPassword('');
  };

  const handleDeposit = () => {
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      setMessage('Enter valid amount');
      return;
    }
    const amount = Number(depositAmount);
    
    // Check if selected agent is online
    if (!agents[selectedAgent] || !agents[selectedAgent].online) {
      setMessage('Selected agent is not online. Please choose an online agent.');
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      amount: amount,
      type: 'deposit',
      status: 'pending',
      date: new Date().toISOString(),
      userPhone: currentUser.phone,
      agentId: selectedAgent,
      agentName: agents[selectedAgent]?.name
    };
    
    setTransactions([...transactions, newTransaction]);
    setDepositAmount('');
    setMessage(`Deposit request of ${amount} ETB sent to ${agents[selectedAgent]?.name}. Send Telebirr to ${agents[selectedAgent]?.telebirr}`);
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
    
    // Check if selected agent is online
    if (!agents[selectedAgent] || !agents[selectedAgent].online) {
      setMessage('Selected agent is not online. Please choose an online agent.');
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      amount: amount,
      type: 'withdrawal',
      status: 'pending',
      date: new Date().toISOString(),
      userPhone: currentUser.phone,
      agentId: selectedAgent,
      agentName: agents[selectedAgent]?.name
    };
    
    setTransactions([...transactions, newTransaction]);
    setWithdrawAmount('');
    setMessage(`Withdrawal request of ${amount} ETB submitted for approval`);
  };

  // ==================== ADMIN FUNCTIONS ====================

  const handleAdminLogin = () => {
    if (adminPass === 'admin123') {
      clearAllSessions();
      setAdminLoggedIn(true);
      localStorage.setItem('amikoAdminLoggedIn', JSON.stringify(true));
      setMessage('Admin logged in');
    } else {
      setMessage('Invalid admin password');
    }
    setAdminPass('');
  };

  const handleApproveWithdrawal = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users[transaction.userPhone];
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

  // ==================== AGENT FUNCTIONS ====================

  const handleAgentLogin = () => {
    if (!agentPhone || !agentPassword) {
      setMessage('Please fill all fields');
      return;
    }
    
    const agent = Object.values(agents).find(a => a.phone === agentPhone);
    
    if (!agent || agent.password !== agentPassword) {
      setMessage('Invalid agent credentials');
      return;
    }
    
    clearAllSessions();
    
    // Set agent online
    setAgentOnline(agent.id, true);
    
    setAgentLoggedIn(agent);
    localStorage.setItem('amikoAgentLoggedIn', JSON.stringify(agent));
    setScreen('agentDashboard');
    setMessage(`Welcome ${agent.name}! You are now ONLINE.`);
    setAgentPhone('');
    setAgentPassword('');
  };

  const handleAgentLogout = () => {
    if (agentLoggedIn) {
      // Set agent offline
      setAgentOnline(agentLoggedIn.id, false);
    }
    clearAllSessions();
    setAgentLoggedIn(null);
    setScreen('landing');
    setMessage('Logged out. You are now OFFLINE.');
  };

  const handleConfirmDeposit = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users[transaction.userPhone];
    if (user) {
      const updatedUser = { ...user, balance: user.balance + transaction.amount };
      setUsers({ ...users, [user.phone]: updatedUser });
    }
    
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'completed' } : t
    ));
    
    setMessage(`Deposit of ${transaction.amount} ETB confirmed!`);
  };

  const handleRejectDeposit = (transactionId) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'rejected' } : t
    ));
    setMessage('Deposit rejected');
  };

  const handleProcessWithdrawal = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const user = users[transaction.userPhone];
    if (user && user.balance >= transaction.amount) {
      const updatedUser = { ...user, balance: user.balance - transaction.amount };
      setUsers({ ...users, [user.phone]: updatedUser });
      setTransactions(transactions.map(t => 
        t.id === transactionId ? { ...t, status: 'approved' } : t
      ));
      
      const commission = transaction.amount * 0.05;
      setMessage(`Withdrawal of ${transaction.amount} ETB processed! Commission: ${commission.toFixed(2)} ETB`);
    } else {
      setMessage('Insufficient balance');
    }
  };

  const Logout = () => {
    // Set agent offline if logged in
    if (agentLoggedIn) {
      setAgentOnline(agentLoggedIn.id, false);
    }
    clearAllSessions();
    setCurrentUser(null);
    setAgentLoggedIn(null);
    setAdminLoggedIn(false);
    setScreen('landing');
    setMessage('Logged out successfully!');
  };

  // ==================== STYLES ====================

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
    cardWide: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '800px',
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
    buttonSmall: {
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #00BFFF, #00E5FF)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    buttonDanger: {
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #FF4444, #FF0000)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    buttonWarning: {
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    buttonSuccess: {
      padding: '10px 20px',
      margin: '5px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(45deg, #00FF00, #00CC00)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
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
    },
    transactionItem: {
      background: 'rgba(255,255,255,0.05)',
      padding: '15px',
      borderRadius: '10px',
      margin: '10px 0',
      border: '1px solid rgba(255,255,255,0.05)'
    },
    statusPending: {
      color: '#FFA500',
      fontWeight: 'bold'
    },
    statusCompleted: {
      color: '#00FF00',
      fontWeight: 'bold'
    },
    statusRejected: {
      color: '#FF0000',
      fontWeight: 'bold'
    },
    statusApproved: {
      color: '#00FF00',
      fontWeight: 'bold'
    },
    statusOnline: {
      color: '#00FF00',
      fontWeight: 'bold'
    },
    statusOffline: {
      color: '#FF0000',
      fontWeight: 'bold'
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    }
  };

  // ==================== RENDER FUNCTIONS ====================

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
              <button style={styles.buttonSecondary} onClick={() => setScreen('agentLogin')}>
                Agent Login
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

  // ==================== AGENT LOGIN SCREEN ====================

  if (screen === 'agentLogin') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>👤 Agent Login</h1>
          <p style={{textAlign: 'center', opacity: 0.7, marginBottom: '20px'}}>
            Login to manage deposits and withdrawals
          </p>
          
          {message && <div style={styles.message}>{message}</div>}
          
          <input
            style={styles.input}
            placeholder="Agent Phone Number"
            value={agentPhone}
            onChange={(e) => setAgentPhone(e.target.value)}
            type="tel"
          />
          <input
            style={styles.input}
            placeholder="Agent Password"
            value={agentPassword}
            onChange={(e) => setAgentPassword(e.target.value)}
            type="password"
          />
          
          <button style={styles.button} onClick={handleAgentLogin}>
            Login as Agent
          </button>
          <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
            Back
          </button>
          
          <div style={{marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px'}}>
            <p style={{fontSize: '12px', opacity: 0.6}}>Demo Agents:</p>
            <p style={{fontSize: '12px', opacity: 0.6}}>Agent 1: 0911000001 / agent123</p>
            <p style={{fontSize: '12px', opacity: 0.6}}>Agent 2: 0911000002 / agent123</p>
            <p style={{fontSize: '12px', opacity: 0.6}}>Agent 3: 0911000003 / agent123</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== AGENT DASHBOARD ====================

  if (screen === 'agentDashboard' && agentLoggedIn) {
    const totalDeposits = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = agentWithdrawals.reduce((sum, t) => sum + t.amount, 0);
    const completedDeposits = transactions.filter(t => 
      t.type === 'deposit' && 
      t.status === 'completed' && 
      t.agentId === agentLoggedIn.id
    );
    const totalCommission = completedDeposits.reduce((sum, t) => sum + (t.amount * 0.05), 0);

    return (
      <div style={styles.container}>
        <div style={styles.cardWide}>
          <div style={styles.flex}>
            <h1 style={styles.title}>👤 Agent Dashboard</h1>
            <div style={styles.flex}>
              <span style={styles.statusOnline}>🟢 ONLINE</span>
              <button style={{...styles.buttonWarning, width: 'auto', padding: '10px 20px'}} onClick={switchAccount}>
                🔄 Switch Account
              </button>
              <button style={{...styles.buttonSecondary, width: 'auto', padding: '10px 20px'}} onClick={handleAgentLogout}>
                Logout
              </button>
            </div>
          </div>
          
          <p style={{textAlign: 'center', opacity: 0.7}}>
            Welcome, {agentLoggedIn.name}! 📱 {agentLoggedIn.telebirr}
          </p>

          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.grid}>
            <div style={styles.gameCard}>
              <h4>💰 Pending Deposits</h4>
              <p style={{fontSize: '2em', color: '#FFA500'}}>{pendingDeposits.length}</p>
              <p>{totalDeposits} ETB</p>
            </div>
            <div style={styles.gameCard}>
              <h4>💸 Pending Withdrawals</h4>
              <p style={{fontSize: '2em', color: '#FF6B6B'}}>{agentWithdrawals.length}</p>
              <p>{totalWithdrawals} ETB</p>
            </div>
            <div style={styles.gameCard}>
              <h4>📊 Commission</h4>
              <p style={{fontSize: '2em', color: '#00E5FF'}}>{totalCommission.toFixed(2)} ETB</p>
              <p>From {completedDeposits.length} deposits</p>
            </div>
          </div>

          <h3>📥 Pending Deposits</h3>
          {pendingDeposits.length === 0 ? (
            <p style={{opacity: 0.6}}>No pending deposits</p>
          ) : (
            pendingDeposits.map((t, i) => (
              <div key={i} style={styles.transactionItem}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button style={styles.buttonSmall} onClick={() => handleConfirmDeposit(t.id)}>
                      ✅ Confirm
                    </button>
                    <button style={styles.buttonDanger} onClick={() => handleRejectDeposit(t.id)}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <h3>📤 Pending Withdrawals</h3>
          {agentWithdrawals.length === 0 ? (
            <p style={{opacity: 0.6}}>No pending withdrawals</p>
          ) : (
            agentWithdrawals.map((t, i) => (
              <div key={i} style={styles.transactionItem}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button style={styles.buttonSmall} onClick={() => handleProcessWithdrawal(t.id)}>
                      💸 Process
                    </button>
                    <button style={styles.buttonDanger} onClick={() => handleRejectWithdrawal(t.id)}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <h3>📋 Recent Transactions</h3>
          {transactions.filter(t => t.agentId === agentLoggedIn.id).slice(-5).reverse().map((t, i) => (
            <div key={i} style={styles.transactionItem}>
              <div style={styles.flex}>
                <div>
                  <p>{t.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'}</p>
                  <p>{t.amount} ETB</p>
                </div>
                <div>
                  <span style={
                    t.status === 'pending' ? styles.statusPending :
                    t.status === 'completed' || t.status === 'approved' ? styles.statusCompleted :
                    styles.statusRejected
                  }>
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ==================== ADMIN PANEL ====================

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
    const pendingDepositsAll = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
    const totalUsers = Object.keys(users).length;
    const totalTransactions = transactions.length;
    const onlineAgents = getOnlineAgents();

    return (
      <div style={styles.container}>
        <div style={styles.cardWide}>
          <div style={styles.flex}>
            <h1 style={styles.title}>👑 Admin Dashboard</h1>
            <div style={styles.flex}>
              <button style={{...styles.buttonWarning, width: 'auto', padding: '10px 20px'}} onClick={switchAccount}>
                🔄 Switch Account
              </button>
              <button style={{...styles.buttonSecondary, width: 'auto', padding: '10px 20px'}} onClick={Logout}>
                Logout
              </button>
            </div>
          </div>
          
          <div style={styles.grid}>
            <div style={styles.gameCard}>
              <h3>👤 Users</h3>
              <p style={{fontSize: '2em'}}>{totalUsers}</p>
            </div>
            <div style={styles.gameCard}>
              <h3>💰 Pending Deposits</h3>
              <p style={{fontSize: '2em'}}>{pendingDepositsAll.length}</p>
            </div>
            <div style={styles.gameCard}>
              <h3>⏳ Pending Withdrawals</h3>
              <p style={{fontSize: '2em'}}>{pendingWithdrawals.length}</p>
            </div>
            <div style={styles.gameCard}>
              <h3>🟢 Online Agents</h3>
              <p style={{fontSize: '2em', color: '#00FF00'}}>{onlineAgents.length}</p>
            </div>
          </div>

          <h3>🟢 Online Agents</h3>
          {onlineAgents.length === 0 ? (
            <p style={{opacity: 0.6}}>No agents online</p>
          ) : (
            onlineAgents.map((agent, i) => (
              <div key={i} style={styles.transactionItem}>
                <p><strong>{agent.name}</strong> - 📱 {agent.phone}</p>
                <p>💰 Commission: {agent.commission}</p>
              </div>
            ))
          )}

          <h3>📊 All Agents</h3>
          {Object.values(agents).map((agent, i) => (
            <div key={i} style={styles.transactionItem}>
              <div style={styles.flex}>
                <div>
                  <p><strong>{agent.name}</strong> - 📱 {agent.phone}</p>
                  <p>💰 Commission: {agent.commission}</p>
                </div>
                <span style={agent.online ? styles.statusOnline : styles.statusOffline}>
                  {agent.online ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </span>
              </div>
            </div>
          ))}

          {message && <div style={styles.message}>{message}</div>}

          <h3>📊 All Users</h3>
          {Object.values(users).map((user, i) => (
            <div key={i} style={styles.transactionItem}>
              <p><strong>{user.name}</strong> - 📱 {user.phone}</p>
              <p>💰 Balance: {user.balance} ETB</p>
            </div>
          ))}

          <h3>📋 Pending Withdrawals</h3>
          {pendingWithdrawals.length === 0 ? (
            <p>No pending withdrawals</p>
          ) : (
            pendingWithdrawals.map((t, i) => (
              <div key={i} style={styles.transactionItem}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Agent:</strong> {t.agentName || 'Unknown'}</p>
                  </div>
                  <div>
                    <button style={styles.buttonSmall} onClick={() => handleApproveWithdrawal(t.id)}>
                      ✅ Approve
                    </button>
                    <button style={styles.buttonDanger} onClick={() => handleRejectWithdrawal(t.id)}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <button style={styles.buttonSecondary} onClick={() => setScreen('landing')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ==================== USER DASHBOARD ====================

  if (screen === 'dashboard' && currentUser) {
    const userTransactions = transactions.filter(t => t.userPhone === currentUser.phone);
    const pendingWithdrawals = userTransactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const pendingDepositsUser = userTransactions.filter(t => t.type === 'deposit' && t.status === 'pending');
    
    // Get only online agents
    const onlineAgents = getOnlineAgents();

    return (
      <div style={styles.container}>
        <div style={styles.cardWide}>
          <div style={styles.flex}>
            <h1 style={styles.title}>🎯 AMIKO BET</h1>
            <div style={styles.flex}>
              <button style={{...styles.buttonWarning, width: 'auto', padding: '10px 20px'}} onClick={switchAccount}>
                🔄 Switch Account
              </button>
              <button style={{...styles.buttonSecondary, width: 'auto', padding: '10px 20px'}} onClick={Logout}>
                Logout
              </button>
            </div>
          </div>
          
          <div style={{textAlign: 'center', margin: '20px 0'}}>
            <p>👤 {currentUser.name || 'User'}</p>
            <p>📱 {currentUser.phone}</p>
            <h2 style={{fontSize: '3em', color: '#00E5FF'}}>💰 {currentUser.balance} ETB</h2>
            {pendingDepositsUser.length > 0 && (
              <p style={{color: '#FFA500'}}>⏳ {pendingDepositsUser.length} deposit(s) pending approval</p>
            )}
          </div>

          {message && <div style={styles.message}>{message}</div>}

          {/* Show online agents count */}
          <p style={{textAlign: 'center', color: '#00FF00'}}>
            🟢 {onlineAgents.length} Agent(s) Online
          </p>

          {onlineAgents.length === 0 ? (
            <div style={styles.message} style={{...styles.message, background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)'}}>
              ⚠️ No agents are currently online. Please try again later.
            </div>
          ) : (
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
                <select
                  style={styles.input}
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  {onlineAgents.map((agent) => (
                    <option key={agent.id} value={agent.id} style={{color: '#000'}}>
                      🟢 {agent.name} - {agent.telebirr} ({agent.commission})
                    </option>
                  ))}
                </select>
                <button style={styles.button} onClick={handleDeposit}>
                  Deposit via Agent
                </button>
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
                <select
                  style={styles.input}
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  {onlineAgents.map((agent) => (
                    <option key={agent.id} value={agent.id} style={{color: '#000'}}>
                      🟢 {agent.name} - {agent.telebirr}
                    </option>
                  ))}
                </select>
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
          )}

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
            <div key={i} style={styles.transactionItem}>
              <div style={styles.flex}>
                <div>
                  <p>{t.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'} - {t.amount} ETB</p>
                  <p style={{fontSize: '12px', opacity: 0.6}}>Agent: {t.agentName || 'Unknown'}</p>
                </div>
                <span style={
                  t.status === 'pending' ? styles.statusPending :
                  t.status === 'completed' || t.status === 'approved' ? styles.statusCompleted :
                  styles.statusRejected
                }>
                  {t.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}

          <button style={styles.buttonSecondary} onClick={() => setScreen('agentLogin')}>
            Agent Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<AmikoBet />);