import React, { useState, useEffect } from 'react';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

const LoginPage: React.import React, { useState, useEffect } from 'react';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with default admin user if no users exist
        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]');
        if (storedUsers.length === 0) {
            storedUsers.push({ username: 'faculty', password: 'password123' });
            storedUsers.push({ username: 'admin', password: 'adminpassword' });
            localStorage.setItem('facultyUsers', JSON.stringify(storedUsers));
        } else if (!storedUsers.find((u: any) => u.username === 'admin')) {
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

        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]');
        const validUser = storedUsers.find((u: any) => u.username === username && u.password === password);
        
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
                <span>, Assistant Professor</span>
            </div>
        </div>
    );
};

export default LoginPage;
<LoginPageProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [subject, setSubject] = useState('');
    const [teachingYear, setTeachingYear] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with default admin user if no users exist
        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]');
        if (storedUsers.length === 0) {
            storedUsers.push({ username: 'faculty', password: 'password123' });
            storedUsers.push({ username: 'admin', password: 'adminpassword' });
            localStorage.setItem('facultyUsers', JSON.stringify(storedUsers));
        } else if (!storedUsers.find((u: any) => u.username === 'admin')) {
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

        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]');
        
        if (isLoginView) {
            const validUser = storedUsers.find((u: any) => u.username === username && u.password === password);
            if (validUser) {
                recordLogin(username);
                onLogin(username);
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } else {
            if (!fullName.trim() || !subject.trim() || !teachingYear.trim()) {
                setError('All fields are required for registration.');
                return;
            }
            const userExists = storedUsers.find((u: any) => u.username === username);
            if (userExists) {
                setError('Username already exists. Please choose a different one.');
            } else {
                storedUsers.push({ 
                    username, 
                    password, 
                    fullName, 
                    subject, 
                    teachingYear 
                });
                localStorage.setItem('facultyUsers', JSON.stringify(storedUsers));
                recordLogin(username);
                onLogin(username);
            }
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
                        {isLoginView ? 'Faculty Portal — Sign in to continue' : 'Faculty Portal — Create an account'}
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
                    {!isLoginView && (
                        <>
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Faculty Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="e.g. Dr. John Smith"
                                    style={{
                                        marginTop: 8, width: '100%', boxSizing: 'border-box',
                                        padding: '11px 14px', borderRadius: 10,
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        color: '#fff', fontSize: 14, outline: 'none',
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Teaching Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. DBMS"
                                        style={{
                                            marginTop: 8, width: '100%', boxSizing: 'border-box',
                                            padding: '11px 14px', borderRadius: 10,
                                            background: 'rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', fontSize: 14, outline: 'none',
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Year
                                    </label>
                                    <select
                                        value={teachingYear}
                                        onChange={e => setTeachingYear(e.target.value)}
                                        style={{
                                            marginTop: 8, width: '100%', boxSizing: 'border-box',
                                            padding: '11px 14px', borderRadius: 10,
                                            background: 'rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#fff', fontSize: 14, outline: 'none',
                                            appearance: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        <option value="" style={{ background: '#1e1b4b' }}>Select Year</option>
                                        <option value="II yr" style={{ background: '#1e1b4b' }}>II yr</option>
                                        <option value="III yr" style={{ background: '#1e1b4b' }}>III yr</option>
                                        <option value="IV yr" style={{ background: '#1e1b4b' }}>IV yr</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
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
                        {isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <button
                            type="button"
                            onClick={() => { setIsLoginView(!isLoginView); setError(''); setUsername(''); setPassword(''); }}
                            style={{
                                background: 'none', border: 'none',
                                color: '#a5b4fc', fontSize: 13, cursor: 'pointer',
                                textDecoration: 'underline', padding: 0
                            }}
                        >
                            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </form>

                {isLoginView && (
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
                        <div>Faculty: faculty / password123</div>
                        <div style={{ marginTop: 4 }}>Admin: admin / adminpassword</div>
                    </div>
                )}
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
                <span>, Assistant Professor</span>
            </div>
        </div>
    );
};

export default LoginPage;
