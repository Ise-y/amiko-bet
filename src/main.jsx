import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './animations.css';

export default function AmikoBet() {
  const [screen, setScreen] = useState('landing');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('amikousers');
    return saved ? JSON.parse(saved) : {
      '0911111111': { phone: '0911111111', password: 'demo123', balance: 5000, name: 'Demo User', kyc: true, role: 'user', rank: 'Gold', wins: 12, losses: 3 },
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
  
  const [activeTab, setActiveTab] = useState('sports');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  
  // ===== AGENTS DATA =====
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
        online: false,
        rating: 4.9,
        totalTransactions: 156
      },
      agent2: { 
        id: 'agent2', 
        name: 'Kebede', 
        telebirr: '0923456789', 
        commission: '3%',
        phone: '0911000002',
        password: 'agent123',
        online: false,
        rating: 4.7,
        totalTransactions: 89
      },
      agent3: { 
        id: 'agent3', 
        name: 'Chala', 
        telebirr: '0934567890', 
        commission: '4%',
        phone: '0911000003',
        password: 'agent123',
        online: false,
        rating: 4.8,
        totalTransactions: 124
      },
    };
  });

  // ===== CLEAR ALL SESSIONS =====
  const clearAllSessions = () => {
    localStorage.removeItem('amikoCurrentUser');
    localStorage.removeItem('amikoAgentLoggedIn');
    localStorage.removeItem('amikoAdminLoggedIn');
  };

  const switchAccount = () => {
    clearAllSessions();
    setCurrentUser(null);
    setAgentLoggedIn(null);
    setAdminLoggedIn(false);
    setScreen('landing');
    setMessage('🔄 Logged out. You can now login with a different account.');
  };

  // ===== AUTO-LOGIN =====
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

  const setAgentOnline = (agentId, status) => {
    const updatedAgents = { ...agents };
    if (updatedAgents[agentId]) {
      updatedAgents[agentId].online = status;
      setAgents(updatedAgents);
      localStorage.setItem('amikoAgents', JSON.stringify(updatedAgents));
    }
  };

  const getOnlineAgents = () => {
    return Object.values(agents).filter(agent => agent.online === true);
  };

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
      [phone]: { phone, password, balance: 100, name: 'User', kyc: false, role: 'user', rank: 'Bronze', wins: 0, losses: 0 }
    });
    setMessage('Registration successful! You get 100 ETB Welcome Bonus! 🎉');
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
    setShowDepositModal(false);
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
    setShowWithdrawModal(false);
    setMessage(`Withdrawal request of ${amount} ETB submitted for approval`);
  };

  const handlePlaceBet = (match, selection, odds) => {
    if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
      setMessage('Enter valid bet amount');
      return;
    }
    const amount = Number(betAmount);
    if (amount > currentUser.balance) {
      setMessage('Insufficient balance');
      return;
    }
    
    const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
    setUsers({ ...users, [currentUser.phone]: updatedUser });
    setCurrentUser(updatedUser);
    
    setTransactions([...transactions, {
      id: Date.now(),
      amount: amount,
      type: 'bet',
      status: 'pending',
      date: new Date().toISOString(),
      userPhone: currentUser.phone,
      match: `${match.home} vs ${match.away}`,
      selection: selection,
      odds: odds,
      potentialWin: (amount * odds).toFixed(2)
    }]);
    
    setBetAmount('');
    setSelectedMatch(null);
    setMessage(`✅ Bet placed: ${amount} ETB on ${match.home} vs ${match.away} - ${selection} at ${odds}x`);
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
      background: '#0a0e1a',
      color: '#ffffff',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    topNav: {
      background: 'linear-gradient(135deg, #0d1b2a, #1a0a2e)',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexWrap: 'wrap',
      gap: '10px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    logo: {
      fontSize: '1.8em',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #00BFFF, #7B2FBE)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: 'pointer'
    },
    topNavLinks: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    navLink: {
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none',
      fontSize: '0.85em',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'transparent',
      border: 'none',
      fontWeight: '600'
    },
    navLinkActive: {
      color: '#00BFFF',
      background: 'rgba(0,191,255,0.1)',
    },
    // Welcome Banner
    welcomeBanner: {
      background: 'linear-gradient(135deg, rgba(0,191,255,0.1), rgba(123,47,190,0.1))',
      padding: '20px',
      margin: '10px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(0,191,255,0.1)',
      textAlign: 'center'
    },
    balanceBar: {
      background: 'rgba(0,191,255,0.05)',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexWrap: 'wrap',
      gap: '10px'
    },
    balanceAmount: {
      fontSize: '2em',
      fontWeight: 'bold',
      color: '#00E5FF',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    actionBtn: {
      padding: '10px 25px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '0.9em',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    depositBtn: {
      background: 'linear-gradient(135deg, #00BFFF, #00E5FF)',
      color: '#fff',
    },
    withdrawBtn: {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    mainContent: {
      padding: '20px',
    },
    tabNav: {
      display: 'flex',
      gap: '5px',
      marginBottom: '20px',
      overflowX: 'auto',
      padding: '5px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexWrap: 'wrap'
    },
    tabBtn: {
      padding: '10px 18px',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.85em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap'
    },
    tabBtnActive: {
      color: '#00BFFF',
      background: 'rgba(0,191,255,0.1)',
    },
    sportsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '15px',
    },
    matchCard: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '15px',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.3s'
    },
    matchTeams: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    oddsRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
    },
    oddsBtn: {
      flex: 1,
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center'
    },
    gamesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
    },
    gameCard: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    gameIcon: {
      fontSize: '3em',
      marginBottom: '10px',
    },
    gameName: {
      fontSize: '0.9em',
      fontWeight: '600',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    },
    modalContent: {
      background: '#1a1a2e',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '450px',
      width: '90%',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    modalTitle: {
      fontSize: '1.5em',
      marginBottom: '20px',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: '14px',
      margin: '10px 0',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    message: {
      padding: '10px',
      borderRadius: '10px',
      margin: '10px 0',
      textAlign: 'center',
      background: 'rgba(0,191,255,0.1)',
      border: '1px solid rgba(0,191,255,0.2)'
    },
    flex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    footer: {
      background: '#0d0d1a',
      padding: '30px 20px',
      marginTop: '30px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center'
    },
    rankBadge: {
      display: 'inline-block',
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '0.8em',
      fontWeight: '700',
      marginLeft: '10px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      margin: '15px 0'
    },
    statCard: {
      background: 'rgba(255,255,255,0.03)',
      padding: '15px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  };

  // ==================== RENDER FUNCTIONS ====================

  // Landing/Login/Register
  if (screen === 'landing' || screen === 'login' || screen === 'register') {
    return (
      <div style={styles.container}>
        <div style={{...styles.topNav, justifyContent: 'center', padding: '30px 20px'}}>
          <h1 style={styles.logo}>🎯 AMIKO BET</h1>
        </div>
        <div style={{maxWidth: '450px', margin: '40px auto', padding: '0 20px'}}>
          <div style={styles.modalContent}>
            <h1 style={styles.modalTitle}>
              {screen === 'landing' ? '🚀 Welcome!' : 
               screen === 'login' ? '🔐 Login' : '✨ Register'}
            </h1>
            <p style={{textAlign: 'center', opacity: 0.6, marginBottom: '20px'}}>
              {screen === 'landing' ? 'The Future of Betting in Ethiopia' : 
               screen === 'login' ? 'Welcome back!' : 'Join the revolution - Get 100 ETB Welcome Bonus!'}
            </p>
            
            {message && <div style={styles.message}>{message}</div>}
            
            <input
              style={styles.input}
              placeholder="📱 Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
            <input
              style={styles.input}
              placeholder="🔑 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            
            {screen === 'landing' && (
              <>
                <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={() => setScreen('login')}>
                  🚀 Login Now
                </button>
                <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('register')}>
                  📝 Create Account
                </button>
                <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('agentLogin')}>
                  👤 Agent Login
                </button>
              </>
            )}
            
            {screen === 'login' && (
              <>
                <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleLogin}>
                  🔓 Login
                </button>
                <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('landing')}>
                  ← Back
                </button>
              </>
            )}
            
            {screen === 'register' && (
              <>
                <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleRegister}>
                  ✨ Register
                </button>
                <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('landing')}>
                  ← Back
                </button>
              </>
            )}
            
            <div style={{textAlign: 'center', marginTop: '20px', opacity: 0.4, fontSize: '0.8em'}}>
              🔒 100% Secure • Fast Transactions • 24/7 Support
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agent Login
  if (screen === 'agentLogin') {
    return (
      <div style={styles.container}>
        <div style={{...styles.topNav, justifyContent: 'center', padding: '30px 20px'}}>
          <h1 style={styles.logo}>👤 Agent Login</h1>
        </div>
        <div style={{maxWidth: '450px', margin: '40px auto', padding: '0 20px'}}>
          <div style={styles.modalContent}>
            <h1 style={styles.modalTitle}>🔐 Agent Login</h1>
            <p style={{textAlign: 'center', opacity: 0.6, marginBottom: '20px'}}>
              Login to manage deposits and withdrawals
            </p>
            
            {message && <div style={styles.message}>{message}</div>}
            
            <input
              style={styles.input}
              placeholder="📱 Agent Phone Number"
              value={agentPhone}
              onChange={(e) => setAgentPhone(e.target.value)}
              type="tel"
            />
            <input
              style={styles.input}
              placeholder="🔑 Agent Password"
              value={agentPassword}
              onChange={(e) => setAgentPassword(e.target.value)}
              type="password"
            />
            
            <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleAgentLogin}>
              🔓 Login as Agent
            </button>
            <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('landing')}>
              ← Back
            </button>
            
            <div style={{marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px'}}>
              <p style={{fontSize: '12px', opacity: 0.6}}>Demo Agents:</p>
              <p style={{fontSize: '12px', opacity: 0.6}}>Agent 1: 0911000001 / agent123</p>
              <p style={{fontSize: '12px', opacity: 0.6}}>Agent 2: 0911000002 / agent123</p>
              <p style={{fontSize: '12px', opacity: 0.6}}>Agent 3: 0911000003 / agent123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agent Dashboard
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
        <div style={styles.topNav}>
          <span style={styles.logo}>👤 Agent Panel</span>
          <div style={styles.topNavLinks}>
            <span style={{color: '#00FF00', fontSize: '0.9em'}}>🟢 ONLINE</span>
            <button style={{...styles.navLink, ...{background: 'rgba(255,165,0,0.2)', color: '#FFA500'}}} onClick={switchAccount}>🔄 Switch</button>
            <button style={{...styles.navLink, ...{color: '#FF4444'}}} onClick={handleAgentLogout}>Logout</button>
          </div>
        </div>

        <div style={styles.balanceBar}>
          <div>
            <p style={{opacity: 0.6, fontSize: '0.9em'}}>Welcome, {agentLoggedIn.name}</p>
            <p style={{fontSize: '0.8em', opacity: 0.5}}>📱 {agentLoggedIn.telebirr}</p>
            <p style={{fontSize: '0.8em', opacity: 0.5}}>⭐ Rating: {agentLoggedIn.rating}/5.0</p>
          </div>
          <div style={styles.actionButtons}>
            <span style={{...styles.balanceAmount, fontSize: '1.2em'}}>💰 {totalCommission.toFixed(2)} ETB Commission</span>
          </div>
        </div>

        {message && <div style={{...styles.message, margin: '10px 20px'}}>{message}</div>}

        <div style={styles.mainContent}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h4>💰 Pending Deposits</h4>
              <p style={{fontSize: '2em', color: '#FFA500'}}>{pendingDeposits.length}</p>
              <p>{totalDeposits} ETB</p>
            </div>
            <div style={styles.statCard}>
              <h4>💸 Pending Withdrawals</h4>
              <p style={{fontSize: '2em', color: '#FF6B6B'}}>{agentWithdrawals.length}</p>
              <p>{totalWithdrawals} ETB</p>
            </div>
            <div style={styles.statCard}>
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
              <div key={i} style={styles.matchCard}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em'}} onClick={() => handleConfirmDeposit(t.id)}>
                      ✅ Confirm
                    </button>
                    <button style={{...styles.actionBtn, ...styles.withdrawBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '5px'}} onClick={() => handleRejectDeposit(t.id)}>
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
              <div key={i} style={styles.matchCard}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em'}} onClick={() => handleProcessWithdrawal(t.id)}>
                      💸 Process
                    </button>
                    <button style={{...styles.actionBtn, ...styles.withdrawBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '5px'}} onClick={() => handleRejectWithdrawal(t.id)}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Admin Panel
  if (screen === 'admin' || adminLoggedIn) {
    if (!adminLoggedIn) {
      return (
        <div style={styles.container}>
          <div style={{...styles.topNav, justifyContent: 'center', padding: '30px 20px'}}>
            <h1 style={styles.logo}>🔐 Admin Login</h1>
          </div>
          <div style={{maxWidth: '450px', margin: '40px auto', padding: '0 20px'}}>
            <div style={styles.modalContent}>
              <h1 style={styles.modalTitle}>Admin Access</h1>
              {message && <div style={styles.message}>{message}</div>}
              <input
                style={styles.input}
                placeholder="Admin Password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                type="password"
              />
              <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleAdminLogin}>
                Login as Admin
              </button>
              <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setScreen('landing')}>
                Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const pendingDepositsAll = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
    const totalUsers = Object.keys(users).length;
    const onlineAgents = getOnlineAgents();
    const totalBets = transactions.filter(t => t.type === 'bet').length;

    return (
      <div style={styles.container}>
        <div style={styles.topNav}>
          <span style={styles.logo}>👑 Admin Dashboard</span>
          <div style={styles.topNavLinks}>
            <button style={{...styles.navLink, ...{background: 'rgba(255,165,0,0.2)', color: '#FFA500'}}} onClick={switchAccount}>🔄 Switch</button>
            <button style={{...styles.navLink, ...{color: '#FF4444'}}} onClick={Logout}>Logout</button>
          </div>
        </div>

        {message && <div style={{...styles.message, margin: '10px 20px'}}>{message}</div>}

        <div style={styles.mainContent}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3>👤 Users</h3>
              <p style={{fontSize: '2em'}}>{totalUsers}</p>
            </div>
            <div style={styles.statCard}>
              <h3>💰 Pending Deposits</h3>
              <p style={{fontSize: '2em'}}>{pendingDepositsAll.length}</p>
            </div>
            <div style={styles.statCard}>
              <h3>⏳ Pending Withdrawals</h3>
              <p style={{fontSize: '2em'}}>{pendingWithdrawals.length}</p>
            </div>
            <div style={styles.statCard}>
              <h3>🟢 Online Agents</h3>
              <p style={{fontSize: '2em', color: '#00FF00'}}>{onlineAgents.length}</p>
            </div>
            <div style={styles.statCard}>
              <h3>🎯 Total Bets</h3>
              <p style={{fontSize: '2em'}}>{totalBets}</p>
            </div>
          </div>

          <h3>🟢 Online Agents</h3>
          {onlineAgents.length === 0 ? (
            <p style={{opacity: 0.6}}>No agents online</p>
          ) : (
            onlineAgents.map((agent, i) => (
              <div key={i} style={styles.matchCard}>
                <p><strong>{agent.name}</strong> - 📱 {agent.phone} - ⭐ {agent.rating}/5.0</p>
                <p>💰 Commission: {agent.commission} | 📊 {agent.totalTransactions} transactions</p>
              </div>
            ))
          )}

          <h3>📊 All Users</h3>
          {Object.values(users).map((user, i) => (
            <div key={i} style={styles.matchCard}>
              <p><strong>{user.name}</strong> - 📱 {user.phone}</p>
              <p>💰 Balance: {user.balance} ETB | 🏅 {user.rank} | 🏆 Wins: {user.wins || 0}</p>
            </div>
          ))}

          <h3>📋 Pending Withdrawals</h3>
          {pendingWithdrawals.length === 0 ? (
            <p>No pending withdrawals</p>
          ) : (
            pendingWithdrawals.map((t, i) => (
              <div key={i} style={styles.matchCard}>
                <div style={styles.flex}>
                  <div>
                    <p><strong>Customer:</strong> {t.userPhone}</p>
                    <p><strong>Amount:</strong> {t.amount} ETB</p>
                    <p><strong>Agent:</strong> {t.agentName || 'Unknown'}</p>
                  </div>
                  <div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em'}} onClick={() => handleApproveWithdrawal(t.id)}>
                      ✅ Approve
                    </button>
                    <button style={{...styles.actionBtn, ...styles.withdrawBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '5px'}} onClick={() => handleRejectWithdrawal(t.id)}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ==================== USER DASHBOARD (ZPLAY-STYLE WITH RANK) ====================

  if (screen === 'dashboard' && currentUser) {
    const userTransactions = transactions.filter(t => t.userPhone === currentUser.phone);
    const pendingWithdrawals = userTransactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const pendingDepositsUser = userTransactions.filter(t => t.type === 'deposit' && t.status === 'pending');
    const onlineAgents = getOnlineAgents();
    const userBets = userTransactions.filter(t => t.type === 'bet');
    const totalWins = userBets.filter(t => t.status === 'approved').length;

    // Sports matches data
    const matches = [
      { home: 'Ivory Coast', away: 'Norway', odds: { home: 3.6, draw: 3.5, away: 2.15 } },
      { home: 'France', away: 'Sweden', odds: { home: 1.3, draw: 6.1, away: 9.8 } },
      { home: 'Mexico', away: 'Ecuador', odds: { home: 2.3, draw: 2.9, away: 4 } },
      { home: 'England', away: 'Germany', odds: { home: 19.0, draw: 5.55, away: 13 } },
    ];

    const casinoGames = [
      { icon: '🎰', name: 'Slots' },
      { icon: '🎲', name: 'Live Casino' },
      { icon: '📺', name: 'TV Games' },
      { icon: '🏏', name: 'Virtual Sport' },
    ];

    const crashGames = [
      { icon: '🚀', name: 'ZPLAY JETX' },
      { icon: '💥', name: 'Crash' },
      { icon: '🎯', name: 'Keno' },
      { icon: '🃏', name: 'HiLo' },
    ];

    // Rank colors
    const rankColors = {
      'Bronze': '#CD7F32',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Platinum': '#E5E4E2',
      'Diamond': '#B9F2FF'
    };

    return (
      <div style={styles.container}>
        {/* Top Navigation */}
        <div style={styles.topNav}>
          <span style={styles.logo}>🎯 AMIKO BET</span>
          <div style={styles.topNavLinks}>
            <span style={{color: '#00FF00', fontSize: '0.8em'}}>🟢 LIVE</span>
            <button style={{...styles.navLink, ...{background: 'rgba(255,165,0,0.2)', color: '#FFA500'}}} onClick={switchAccount}>🔄 Switch</button>
            <button style={{...styles.navLink, ...{color: '#FF4444'}}} onClick={Logout}>Logout</button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <h2>🎉 Welcome {currentUser.name || 'User'}!</h2>
          <p style={{opacity: 0.7}}>Your Rank: <span style={{color: rankColors[currentUser.rank] || '#FFD700', fontWeight: 'bold'}}>{currentUser.rank}</span></p>
          <p style={{fontSize: '0.9em', opacity: 0.5}}>🏆 {totalWins} Wins | 📊 {userBets.length} Bets Placed</p>
        </div>

        {/* Balance Bar */}
        <div style={styles.balanceBar}>
          <div>
            <p style={{opacity: 0.6, fontSize: '0.9em'}}>💰 Balance</p>
            <span style={styles.balanceAmount}>{currentUser.balance} ETB</span>
            {pendingDepositsUser.length > 0 && (
              <p style={{fontSize: '0.8em', color: '#FFA500'}}>⏳ {pendingDepositsUser.length} deposit(s) pending</p>
            )}
          </div>
          <div style={styles.actionButtons}>
            <button style={{...styles.actionBtn, ...styles.depositBtn}} onClick={() => setShowDepositModal(true)}>
              💳 Deposit
            </button>
            <button style={{...styles.actionBtn, ...styles.withdrawBtn}} onClick={() => setShowWithdrawModal(true)}>
              💸 Withdraw
            </button>
          </div>
        </div>

        {message && <div style={{...styles.message, margin: '10px 20px'}}>{message}</div>}

        {/* Tab Navigation */}
        <div style={{...styles.tabNav, padding: '0 20px'}}>
          {['Sports', 'Live Casino', 'Games', 'Crash', 'Virtual Sport'].map((tab) => (
            <button
              key={tab}
              style={{...styles.tabBtn, ...(activeTab === tab.toLowerCase() ? styles.tabBtnActive : {})}}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{...styles.mainContent, padding: '0 20px 20px'}}>
          {/* Sports Tab */}
          {activeTab === 'sports' && (
            <>
              <h2 style={{marginBottom: '15px'}}>⚽ Football</h2>
              <p style={{opacity: 0.5, marginBottom: '20px'}}>World Cup 2026</p>
              <div style={styles.sportsGrid}>
                {matches.map((match, i) => (
                  <div key={i} style={styles.matchCard}>
                    <div style={styles.matchTeams}>
                      <span>{match.home}</span>
                      <span style={{opacity: 0.3}}>VS</span>
                      <span>{match.away}</span>
                    </div>
                    <div style={styles.oddsRow}>
                      <button style={styles.oddsBtn} onClick={() => {setSelectedMatch(match); setBetAmount('');}}>
                        <div>W1</div>
                        <div style={{color: '#00E5FF'}}>{match.odds.home}</div>
                      </button>
                      <button style={styles.oddsBtn} onClick={() => {setSelectedMatch(match); setBetAmount('');}}>
                        <div>X</div>
                        <div style={{color: '#00E5FF'}}>{match.odds.draw}</div>
                      </button>
                      <button style={styles.oddsBtn} onClick={() => {setSelectedMatch(match); setBetAmount('');}}>
                        <div>W2</div>
                        <div style={{color: '#00E5FF'}}>{match.odds.away}</div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bet Placement Section */}
              {selectedMatch && (
                <div style={{...styles.modalContent, maxWidth: '500px', margin: '20px auto'}}>
                  <h3 style={styles.modalTitle}>Place Bet</h3>
                  <p>{selectedMatch.home} vs {selectedMatch.away}</p>
                  <input
                    style={styles.input}
                    placeholder="Amount to bet (ETB)"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    type="number"
                  />
                  <div style={styles.oddsRow}>
                    <button style={{...styles.oddsBtn, ...{background: 'rgba(0,191,255,0.2)'}}} onClick={() => handlePlaceBet(selectedMatch, 'W1', selectedMatch.odds.home)}>
                      W1 {selectedMatch.odds.home}x
                    </button>
                    <button style={{...styles.oddsBtn, ...{background: 'rgba(0,191,255,0.2)'}}} onClick={() => handlePlaceBet(selectedMatch, 'Draw', selectedMatch.odds.draw)}>
                      Draw {selectedMatch.odds.draw}x
                    </button>
                    <button style={{...styles.oddsBtn, ...{background: 'rgba(0,191,255,0.2)'}}} onClick={() => handlePlaceBet(selectedMatch, 'W2', selectedMatch.odds.away)}>
                      W2 {selectedMatch.odds.away}x
                    </button>
                  </div>
                  <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setSelectedMatch(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

          {/* Live Casino Tab */}
          {activeTab === 'live casino' && (
            <>
              <h2 style={{marginBottom: '15px'}}>🎲 Live Casino</h2>
              <p style={{opacity: 0.5, marginBottom: '20px'}}>Play with real dealers</p>
              <div style={styles.gamesGrid}>
                {casinoGames.map((game, i) => (
                  <div key={i} style={styles.gameCard}>
                    <div style={styles.gameIcon}>{game.icon}</div>
                    <div style={styles.gameName}>{game.name}</div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                      Play Now
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <>
              <h2 style={{marginBottom: '15px'}}>🎮 Games</h2>
              <p style={{opacity: 0.5, marginBottom: '20px'}}>Popular casino games</p>
              <div style={styles.gamesGrid}>
                {casinoGames.map((game, i) => (
                  <div key={i} style={styles.gameCard}>
                    <div style={styles.gameIcon}>{game.icon}</div>
                    <div style={styles.gameName}>{game.name}</div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                      Play Now
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Crash Tab */}
          {activeTab === 'crash' && (
            <>
              <h2 style={{marginBottom: '15px'}}>🚀 Crash Games</h2>
              <p style={{opacity: 0.5, marginBottom: '20px'}}>Watch and win!</p>
              <div style={styles.gamesGrid}>
                {crashGames.map((game, i) => (
                  <div key={i} style={styles.gameCard}>
                    <div style={styles.gameIcon}>{game.icon}</div>
                    <div style={styles.gameName}>{game.name}</div>
                    <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                      Play Now
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Virtual Sport Tab */}
          {activeTab === 'virtual sport' && (
            <>
              <h2 style={{marginBottom: '15px'}}>🏏 Virtual Sport</h2>
              <p style={{opacity: 0.5, marginBottom: '20px'}}>Virtual matches, real excitement!</p>
              <div style={styles.gamesGrid}>
                <div style={styles.gameCard}>
                  <div style={{fontSize: '3em'}}>⚽</div>
                  <div style={styles.gameName}>Virtual Football</div>
                  <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                    Play Now
                  </button>
                </div>
                <div style={styles.gameCard}>
                  <div style={{fontSize: '3em'}}>🏇</div>
                  <div style={styles.gameName}>Horse Racing</div>
                  <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                    Play Now
                  </button>
                </div>
                <div style={styles.gameCard}>
                  <div style={{fontSize: '3em'}}>🏀</div>
                  <div style={styles.gameName}>Virtual Basketball</div>
                  <button style={{...styles.actionBtn, ...styles.depositBtn, padding: '8px 20px', fontSize: '0.8em', marginTop: '10px'}}>
                    Play Now
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Online Agents Status */}
          <div style={{marginTop: '30px', padding: '15px', background: 'rgba(0,191,255,0.03)', borderRadius: '12px', border: '1px solid rgba(0,191,255,0.05)'}}>
            <p style={{textAlign: 'center'}}>
              🟢 {onlineAgents.length} Agent(s) Online
            </p>
          </div>

          {/* Recent Transactions */}
          <h2 style={{marginTop: '30px', fontSize: '1.2em'}}>📜 Recent Transactions</h2>
          {userTransactions.slice(-5).reverse().map((t, i) => (
            <div key={i} style={{...styles.matchCard, marginTop: '10px'}}>
              <div style={styles.flex}>
                <div>
                  <p style={{fontWeight: '600'}}>
                    {t.type === 'deposit' ? '💰 Deposit' : t.type === 'withdrawal' ? '💸 Withdrawal' : '🎯 Bet'}
                  </p>
                  <p style={{fontSize: '0.9em', opacity: 0.6}}>
                    {t.amount} ETB {t.type === 'bet' ? `on ${t.match || ''}` : ''} 
                    {t.type === 'bet' ? ` - ${t.selection || ''}` : `• Agent: ${t.agentName || 'Unknown'}`}
                    {t.potentialWin ? ` | Potential Win: ${t.potentialWin} ETB` : ''}
                  </p>
                </div>
                <span style={
                  t.status === 'pending' ? {color: '#FFA500', fontWeight: 'bold'} :
                  t.status === 'completed' || t.status === 'approved' ? {color: '#00FF00', fontWeight: 'bold'} :
                  {color: '#FF4444', fontWeight: 'bold'}
                }>
                  {t.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={{opacity: 0.5, fontSize: '0.9em'}}>🔒 Secure & Instant Deposits and Withdrawals</p>
          <p style={{opacity: 0.3, fontSize: '0.8em', marginTop: '10px'}}>© 2026 Amiko Bet • 21+ • Play Responsibly</p>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div style={styles.modalOverlay} onClick={() => setShowDepositModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>💳 Deposit</h2>
              {onlineAgents.length === 0 ? (
                <p style={{textAlign: 'center', color: '#FF4444'}}>No agents online. Please try again later.</p>
              ) : (
                <>
                  <input
                    style={styles.input}
                    placeholder="Amount (ETB)"
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
                        🟢 {agent.name} - {agent.telebirr} (⭐ {agent.rating})
                      </option>
                    ))}
                  </select>
                  <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleDeposit}>
                    Confirm Deposit
                  </button>
                </>
              )}
              <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setShowDepositModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div style={styles.modalOverlay} onClick={() => setShowWithdrawModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>💸 Withdraw</h2>
              {onlineAgents.length === 0 ? (
                <p style={{textAlign: 'center', color: '#FF4444'}}>No agents online. Please try again later.</p>
              ) : (
                <>
                  <input
                    style={styles.input}
                    placeholder="Amount (ETB)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    type="number"
                  />
                  <p style={{fontSize: '0.8em', opacity: 0.5}}>Available: {currentUser.balance} ETB</p>
                  <select
                    style={styles.input}
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    {onlineAgents.map((agent) => (
                      <option key={agent.id} value={agent.id} style={{color: '#000'}}>
                        🟢 {agent.name} - {agent.telebirr} (⭐ {agent.rating})
                      </option>
                    ))}
                  </select>
                  <button style={{...styles.actionBtn, ...styles.depositBtn, width: '100%'}} onClick={handleWithdraw}>
                    Confirm Withdrawal
                  </button>
                </>
              )}
              <button style={{...styles.actionBtn, ...styles.withdrawBtn, width: '100%', marginTop: '10px'}} onClick={() => setShowWithdrawModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<AmikoBet />);