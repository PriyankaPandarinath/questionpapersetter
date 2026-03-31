import React, { useState, useEffect } from 'react';

interface User {
    username: string;
    password?: string;
    fullName?: string;
}

interface LoginPageProps {
    onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with default admin user if no users exist
        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]') as User[];
        if (storedUsers.length === 0) {
            storedUsers.push({ username: 'faculty', password: 'password123' });
            storedUsers.push({ username: 'admin', password: 'adminpassword' });
            localStorage.setItem('facultyUsers', JSON.stringify(storedUsers));
        } else if (!storedUsers.find((u: User) => u.username === 'admin')) {
            storedUsers.push({ username: 'admin', password: 'adminpassword' });
            localStorage.setItem('facultyUsers', JSON.stringify(storedUsers));
        }
    }, []);

    const recordLogin = (user: string) => {
        const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        history.unshift({
            username: user,
            timestamp: new Date().toLocaleString(),
            id: Date.now()
        });
        localStorage.setItem('loginHistory', JSON.stringify(history.slice(0, 100))); // Keep last 100
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]') as User[];
        const validUser = storedUsers.find((u: User) => u.username === username && u.password === password);

        if (validUser) {
            recordLogin(username);
            onLogin(username);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        }}>
            {/* Decorative glow blobs */}
            <div style={{ position: 'absolute', top: '15%', left: '20%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px 20px', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '100%', maxWidth: 400, padding: '44px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                    position: 'relative',
                    animation: 'loginFadeIn 0.4s ease-out',
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: 16,
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28, margin: '0 auto 16px',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                        }}>📝</div>
                        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Question Paper Setter</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>
                            Faculty Portal — Sign in to continue
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                            color: '#fca5a5', fontSize: 13, textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        <div>
                            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                style={{
                                    marginTop: 8, width: '100%', boxSizing: 'border-box',
                                    padding: '11px 14px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#fff', fontSize: 14, outline: 'none',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                style={{
                                    marginTop: 8, width: '100%', boxSizing: 'border-box',
                                    padding: '11px 14px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#fff', fontSize: 14, outline: 'none',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                marginTop: 8, padding: '13px',
                                background: 'linear-gradient(90deg, #4338ca, #7c3aed)',
                                border: 'none', borderRadius: 10,
                                color: '#fff', fontWeight: 700, fontSize: 15,
                                cursor: 'pointer', letterSpacing: 0.5,
                                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            Sign In
                        </button>


                    </form>

                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
                        <div>Faculty: faculty / password123</div>
                        <div style={{ marginTop: 4 }}>Admin: admin / adminpassword</div>
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

            {/* Footer */}
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px',
                color: 'rgba(255,255,255,0.3)', fontSize: 12,
                pointerEvents: 'none',
                padding: '20px',
                textAlign: 'center',
                width: '100%',
                position: 'relative',
                zIndex: 1
            }}>
                <span>Developed and Maintained by</span>
                <strong style={{ color: 'rgba(165,180,252,0.6)' }}>Mrs. Priyanka Pandarinath</strong>
                <span>, Assistant Professor, </span>
                <strong style={{ color: 'rgba(165,180,252,0.6)' }}> S. Pranavi Reddy and M. Maniroop</strong>
                <span> (III Data Science)</span>
            </div>
        </div>
    );
};

export default LoginPage;
