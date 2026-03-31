import React, { useState } from 'react';

interface LoginRecord {
    id: number;
    username: string;
    timestamp: string;
}

interface User {
    username: string;
    fullName?: string;
    subject?: string;
    teachingYear?: string;
}

interface AdminDashboardProps {
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('facultyUsers');
        if (!saved) {
            const initial = [
                { username: 'admin', fullName: 'ADMINISTRATOR' },
                { username: 'faculty', fullName: 'Faculty Member', subject: 'CS', teachingYear: 'II yr' }
            ];
            localStorage.setItem('facultyUsers', JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(saved);
    });

    const [history, setHistory] = useState<LoginRecord[]>(() => 
        JSON.parse(localStorage.getItem('loginHistory') || '[]')
    );

    // Form states for new user
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newTeachingYear, setNewTeachingYear] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const clearHistory = () => {
        if (window.confirm('Clear all login history?')) {
            localStorage.setItem('loginHistory', '[]');
            setHistory([]);
        }
    };

    const deleteUser = (username: string) => {
        if (username === 'admin') return;
        if (window.confirm(`Delete user "${username}"?`)) {
            const updatedUsers = users.filter(u => u.username !== username);
            localStorage.setItem('facultyUsers', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (!newUsername.trim() || !newPassword.trim() || !newFullName.trim() || !newSubject.trim() || !newTeachingYear.trim()) {
            setFormError('All fields are required.');
            return;
        }

        if (users.some(u => u.username === newUsername)) {
            setFormError('Username already exists.');
            return;
        }

        const newUser: User = {
            username: newUsername,
            fullName: newFullName,
            subject: newSubject,
            teachingYear: newTeachingYear
        };

        // In a real app we'd save password too, but for this local storage mock we just save it in the same list
        const updatedUsers = [...users, { ...newUser, password: newPassword }];
        localStorage.setItem('facultyUsers', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        
        // Reset form
        setNewUsername('');
        setNewPassword('');
        setNewFullName('');
        setNewSubject('');
        setNewTeachingYear('');
        setFormSuccess('User created successfully!');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
            padding: '40px 24px',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#a5b4fc' }}>Admin Monitoring Dashboard</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Track faculty activity and manage accounts</p>
                    </div>
                    <button 
                        onClick={onBack}
                        style={{
                            padding: '10px 20px', borderRadius: 12, border: 'none',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        ← Back to App
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, alignItems: 'start' }}>
                    {/* LEFT COLUMN: Account Creation & History */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Add User Form */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20, padding: 24,
                        }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#a5b4fc' }}>
                                <span>➕</span> Create New Account
                            </h2>
                            <form onSubmit={handleAddUser}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={labelStyle}>Username</label>
                                        <input 
                                            placeholder="e.g. jsmith" 
                                            value={newUsername} 
                                            onChange={e => setNewUsername(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={newPassword} 
                                            onChange={e => setNewPassword(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input 
                                        placeholder="Dr. John Smith" 
                                        value={newFullName} 
                                        onChange={e => setNewFullName(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 20 }}>
                                    <div>
                                        <label style={labelStyle}>Subject</label>
                                        <input 
                                            placeholder="e.g. DBMS" 
                                            value={newSubject} 
                                            onChange={e => setNewSubject(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Year</label>
                                        <select 
                                            value={newTeachingYear} 
                                            onChange={e => setNewTeachingYear(e.target.value)}
                                            style={inputStyle}
                                        >
                                            <option value="">Select</option>
                                            <option value="II yr">II yr</option>
                                            <option value="III yr">III yr</option>
                                            <option value="IV yr">IV yr</option>
                                        </select>
                                    </div>
                                </div>

                                {formError && <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 15, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8 }}>{formError}</div>}
                                {formSuccess && <div style={{ color: '#6ee7b7', fontSize: 12, marginBottom: 15, background: 'rgba(16,185,129,0.1)', padding: '8px 12px', borderRadius: 8 }}>{formSuccess}</div>}

                                <button type="submit" style={{
                                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                                    background: 'linear-gradient(90deg, #4338ca, #7c3aed)',
                                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                                    boxShadow: '0 4px 12px rgba(67, 56, 202, 0.3)'
                                }}>Add Faculty Account</button>
                            </form>
                        </div>

                        {/* Login History (Moved to left under form for better layout) */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20, padding: 24,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 24 }}>🕒</span> Login History
                                </h2>
                                <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: 12, cursor: 'pointer' }}>Clear</button>
                            </div>
                            <div style={{ 
                                display: 'flex', flexDirection: 'column', gap: 1, 
                                maxHeight: 300, overflowY: 'auto',
                                background: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden'
                            }}>
                                {history.length === 0 ? (
                                    <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No login activity yet.</div>
                                ) : (
                                    history.map((record, idx) => (
                                        <div key={record.id} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                        }}>
                                            <div style={{ fontWeight: 600, color: record.username === 'admin' ? '#fca5a5' : '#e0e7ff', fontSize: 13 }}>{record.username}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{record.timestamp}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Faculty List */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20, padding: 24,
                        minHeight: 600
                    }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 24 }}>👥</span> Registered Faculty ({users.length})
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {users.map(user => (
                                <div key={user.username} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '16px', borderRadius: 16,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'transform 0.2s, background 0.2s',
                                }} onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }} onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ 
                                            width: 40, height: 40, borderRadius: 10, 
                                            background: user.username === 'admin' ? 'linear-gradient(135deg, #ef4444, #b91c1b)' : 'linear-gradient(135deg, #6366f1, #4338ca)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800
                                        }}>
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{user.fullName || user.username}</div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                                                {user.username === 'admin' ? 'Administrator' : `@${user.username} • ${user.subject || 'No Subject'} • ${user.teachingYear || 'N/A'}`}
                                            </div>
                                        </div>
                                    </div>
                                    {user.username !== 'admin' && (
                                        <button 
                                            onClick={() => deleteUser(user.username)}
                                            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#fca5a5', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Delete User"
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6
};

const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};

export default AdminDashboard;
