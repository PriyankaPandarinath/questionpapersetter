import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import QuestionInputForm from './components/QuestionInputForm';
import QuestionPaper from './components/QuestionPaper';
import QuestionBankView from './components/QuestionBankView';
import LoginPage from './components/LoginPage';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import HomeView from './components/HomeView';

import { generateSets } from './components/SetGenerator';
import { generateWordDocument, generatePDF, generateAllWordDocuments, generateAllPDFs } from './utils/documentGenerator';
import type { ExamDetails, Question, QuestionPaperSet, SavedPaper, QuestionBank } from './types';

// ── Shared dark-theme button styles ──────────────────────────────────────────
const NAV_BTN: React.CSSProperties = {
  padding: '8px 18px', borderRadius: 9, border: 'none',
  color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  transition: 'opacity 0.15s',
};
const btn = (bg: string): React.CSSProperties => ({ ...NAV_BTN, background: bg });

// ── Shared footer ─────────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '4px',
      padding: '20px 16px 24px',
      color: 'rgba(255,255,255,0.3)', fontSize: 12,
      textAlign: 'center'
    }}>
      <span>Developed and Maintained by</span>
      <strong style={{ color: 'rgba(165,180,252,0.6)' }}>Mrs. Priyanka Pandarinath</strong>
      <span>, Assistant Professor, </span>
      <strong style={{ color: 'rgba(165,180,252,0.6)' }}>S. Pranavi Reddy and M. Maniroop</strong>
      <span> (III Data Science)</span>
    </div>
  );
}

function NavBar({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 24px',
      background: 'linear-gradient(90deg, #1e1b4b, #312e81)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{left}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{right}</div>
    </div>
  );
}

// ── WhatsApp Share Modal ──────────────────────────────────────────────────────
function WhatsAppModal({ message, onClose }: { message: string; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [editedMsg, setEditedMsg] = useState(message);

  const handleSend = () => {
    const cleaned = phone.replace(/\D/g, '');
    const url = cleaned
      ? `https://wa.me/${cleaned}?text=${encodeURIComponent(editedMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(editedMsg)}`;
    window.open(url, '_blank');
    onClose(); // dismiss modal immediately
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 500,
        background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        animation: 'waMdlIn 0.22s ease-out',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', background: 'linear-gradient(90deg, #16a34a, #25d366)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 22, height: 22 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.07 1.5 5.786L0 24l6.381-1.474A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.576 9.576 0 01-4.885-1.34l-.35-.208-3.63.838.872-3.543-.228-.364A9.538 9.538 0 012.4 12c0-5.295 4.305-9.6 9.6-9.6 5.295 0 9.6 4.305 9.6 9.6 0 5.295-4.305 9.6-9.6 9.6z" />
            </svg>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Share via WhatsApp</span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Phone */}
          <div>
            <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Recipient Phone Number (optional)</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{ padding: '9px 12px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 8, color: '#6ee7b7', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>+91</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="9876543210  (leave blank to open new chat)"
                style={{ flex: 1, padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e0e7ff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 6 }}>Include country code if outside India, e.g. 919876543210</p>
          </div>

          {/* Message editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Message</label>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{editedMsg.length} chars</span>
            </div>
            <textarea
              value={editedMsg}
              onChange={e => setEditedMsg(e.target.value)}
              rows={10}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e0e7ff', fontSize: 12, lineHeight: 1.7, outline: 'none', resize: 'vertical', fontFamily: 'monospace' } as React.CSSProperties}
            />
            <button
              onClick={() => setEditedMsg(message)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', marginTop: 4, padding: 0 }}
            >
              ↺ Reset to default
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button
              onClick={handleSend}
              disabled={!editedMsg.trim()}
              style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: editedMsg.trim() ? 'linear-gradient(90deg, #16a34a, #25d366)' : 'rgba(255,255,255,0.1)', color: editedMsg.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 14, cursor: editedMsg.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.07 1.5 5.786L0 24l6.381-1.474A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.576 9.576 0 01-4.885-1.34l-.35-.208-3.63.838.872-3.543-.228-.364A9.538 9.538 0 012.4 12c0-5.295 4.305-9.6 9.6-9.6 5.295 0 9.6 4.305 9.6 9.6 0 5.295-4.305 9.6-9.6 9.6z" />
              </svg>
              Open in WhatsApp
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes waMdlIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        textarea::-webkit-scrollbar { width:5px; } textarea::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; }
        input[type=tel]::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function ProtectedRoute({ children, isAuthenticated, isAdminRequired = false, isAdmin = false }: { children: React.ReactNode, isAuthenticated: boolean, isAdminRequired?: boolean, isAdmin?: boolean }) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdminRequired && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuth') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [sets, setSets] = useState<QuestionPaperSet[]>([]);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const [showWAModal, setShowWAModal] = useState(false);
  const [waMessage, setWaMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<string>('');

  const [history, setHistory] = useState<SavedPaper[]>(() => {
    const saved = localStorage.getItem('paperHistory');
    const parsed = saved ? JSON.parse(saved) as SavedPaper[] : [];
    if (parsed.length === 0) {
      return [{
        id: 'sample-paper-001',
        date: new Date().toLocaleString(),
        createdBy: 'system',
        isSample: true,
        details: {
          collegeName: "TECH UNIVERSITY OF EXCELLENCE",
          examName: 'B.TECH II YEAR I SEMESTER – SAMPLE EXAMINATION',
          subject: 'Sample: Computer Networks',
          subjectCode: 'CS301',
          branch: 'CSE',
          date: '2026-03-24',
          time: '3 Hours',
          maxMarks: 100,
        },
        sets: [],
        mcqs: [],
        fibs: [],
        partB: [],
      }];
    }
    return parsed;
  });

  const [questionBank, setQuestionBank] = useState<QuestionBank>(() => {
    const saved = localStorage.getItem('questionBank');
    return saved ? JSON.parse(saved) as QuestionBank : {};
  });

  const [details, setDetails] = useState<ExamDetails>(() => {
    const saved = localStorage.getItem('formDetails');
    const d = saved ? JSON.parse(saved) as ExamDetails : {
      collegeName: "TECH UNIVERSITY OF EXCELLENCE",
      examName: 'B.TECH II YEAR I SEMESTER – SAMPLE EXAMINATION',
      subject: 'Sample: Computer Networks',
      subjectCode: 'CS301',
      branch: 'CSE',
      date: '2026-03-24',
      time: '3 Hours',
      maxMarks: 100,
    };
    return d;
  });

  const [mcqs, setMcqs] = useState<Question[]>(() => {
    const saved = localStorage.getItem('formMcqs');
    return saved ? JSON.parse(saved)
      : Array.from({ length: 10 }, (_, i) => ({ id: i + 1, text: '', type: 'MCQ', options: ['', '', '', ''] }));
  });
  const [fibs, setFibs] = useState<Question[]>(() => {
    const saved = localStorage.getItem('formFibs');
    return saved ? JSON.parse(saved)
      : Array.from({ length: 10 }, (_, i) => ({ id: i + 1, text: '', type: 'FIB' }));
  });
  const [partB, setPartB] = useState<Question[]>(() => {
    const saved = localStorage.getItem('formPartB');
    return saved ? JSON.parse(saved)
      : Array.from({ length: 6 }, (_, i) => ({ id: i + 1, text: '', type: 'PART_B', bloomLevel: 'L2, CO-1', marks: 5 }));
  });

  useEffect(() => { localStorage.setItem('paperHistory', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('questionBank', JSON.stringify(questionBank)); }, [questionBank]);
  useEffect(() => { localStorage.setItem('formDetails', JSON.stringify(details)); }, [details]);
  useEffect(() => { localStorage.setItem('formMcqs', JSON.stringify(mcqs)); }, [mcqs]);
  useEffect(() => { localStorage.setItem('formFibs', JSON.stringify(fibs)); }, [fibs]);
  useEffect(() => { localStorage.setItem('formPartB', JSON.stringify(partB)); }, [partB]);



  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    const admin = username.toLowerCase() === 'admin';
    setIsAdmin(admin);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('isAdmin', admin.toString());
    navigate('/');
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setIsAdmin(false);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleGenerate = () => {
    const generatedSets = generateSets(mcqs, fibs, partB);
    setSets(generatedSets);
    setActiveSetIndex(0);
    navigate('/preview');
    const newPaper: SavedPaper = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      createdBy: currentUser,
      details, sets: generatedSets, mcqs, fibs, partB,
    };
    setHistory(prev => [newPaper, ...prev]);
  };

  const handleLoadPaper = (paper: SavedPaper) => {
    setDetails(paper.details);
    setSets(paper.sets);
    setMcqs(paper.mcqs);
    setFibs(paper.fibs);
    setPartB(paper.partB);
    setActiveSetIndex(0);
    navigate('/preview');
  };

  const handleDeletePaper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this paper?')) setHistory(prev => prev.filter(p => p.id !== id));
  };

  const handleDownloadWord = () => { if (sets.length > 0) generateWordDocument(details, sets[activeSetIndex]); };
  const handleDownloadPDF = () => { if (sets.length > 0) generatePDF('question-paper', sets[activeSetIndex].setName); };
  const handleDownloadAllWord = () => { if (sets.length > 0) generateAllWordDocuments(details, sets); };
  const handleDownloadAllPDF = () => {
    if (sets.length > 0) generateAllPDFs(sets.map((_, i) => `print-set-${i}`), `${details.examName}_All_Sets`);
  };

  const handleShareWhatsApp = () => {
    const currentSet = sets[activeSetIndex];
    const msg = [
      `📝 *Question Paper Ready!*`,
      ``,
      `📚 *Subject:* ${details.subject} (${details.subjectCode})`,
      `🏫 *Exam:* ${details.examName}`,
      `🎓 *Branch:* ${details.branch}`,
      `📅 *Date:* ${details.date}`,
      `⏰ *Time:* ${details.time}`,
      `🎯 *Max Marks:* ${details.maxMarks}`,
      `📋 *Set:* ${currentSet?.setName ?? 'N/A'} (${sets.length} sets total)`,
      ``,
      `_Generated using Question Paper Setter_`,
    ].join('\n');
    setWaMessage(msg);
    setShowWAModal(true);
  };


  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Home View */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}>
              <NavBar
                left={
                  <>
                    <span onClick={() => navigate('/')} style={{ color: '#a5b4fc', fontWeight: 800, fontSize: 16, marginRight: 8, cursor: 'pointer' }}>📝 Paper Setter</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, alignSelf: 'center', marginLeft: 8, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                      Welcome, <strong style={{ color: '#fff' }}>{currentUser}</strong>
                    </span>
                  </>
                }
                right={
                  <button style={btn('rgba(239,68,68,0.7)')} onClick={handleLogout}>Logout</button>
                }
              />
              <HomeView currentUser={currentUser} isAdmin={isAdmin} />
              <PageFooter />
            </div>
          </ProtectedRoute>
        } />

        {/* Generator View */}
        <Route path="/generator" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}>
              <NavBar
                left={
                  <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#a5b4fc', fontWeight: 800, fontSize: 16 }}>📝 Paper Setter</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>/ Generator</span>
                  </div>
                }
                right={
                  <>
                    <button style={btn('rgba(107,114,128,0.7)')} onClick={() => navigate('/')}>Home</button>
                    <button style={btn('rgba(124,58,237,0.85)')} onClick={() => navigate('/history')}>Previous Papers</button>
                    <button style={btn('rgba(239,68,68,0.7)')} onClick={handleLogout}>Logout</button>
                  </>
                }
              />
              <QuestionInputForm
                details={details} setDetails={setDetails}
                mcqs={mcqs} setMcqs={setMcqs}
                fibs={fibs} setFibs={setFibs}
                partB={partB} setPartB={setPartB}
                onSubmit={handleGenerate}
                questionBank={questionBank}
              />
              <PageFooter />
            </div>
          </ProtectedRoute>
        } />

        {/* Bank View */}
        <Route path="/bank" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <QuestionBankView questionBank={questionBank} setQuestionBank={setQuestionBank} onBack={() => navigate('/')} />
            <PageFooter />
          </ProtectedRoute>
        } />

        {/* Admin View */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdminRequired isAdmin={isAdmin}>
            <AdminDashboard onBack={() => navigate('/')} />
            <PageFooter />
          </ProtectedRoute>
        } />

        {/* History View */}
        <Route path="/history" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}>
              <NavBar
                left={<span style={{ color: '#a5b4fc', fontWeight: 800, fontSize: 16 }}>📂 Previous Papers</span>}
                right={
                  <>
                    <button style={btn('rgba(107,114,128,0.7)')} onClick={() => navigate('/')}>Home</button>
                    <button style={btn('rgba(59,130,246,0.7)')} onClick={() => navigate('/preview')} disabled={sets.length === 0}>
                      Back to Preview
                    </button>
                  </>
                }
              />
              <div style={{ padding: '36px 32px' }}>
                {(() => {
                  const filteredHistory = history.filter(paper => isAdmin || paper.isSample || paper.createdBy === currentUser);
                  if (filteredHistory.length === 0) return <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 80, fontSize: 16 }}>📄 No saved papers available for you yet.</div>;
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                      {filteredHistory.map(paper => (
                        <div key={paper.id} onClick={() => handleLoadPaper(paper)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '22px 24px', cursor: 'pointer', transition: 'all 0.18s' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                            <div>
                              <div style={{ color: '#e0e7ff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{paper.details.subject}</div>
                              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{paper.details.examName}</div>
                              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>🕐 {paper.date}</div>
                            </div>
                            {paper.isSample ? <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>SAMPLE</div> : <button onClick={e => handleDeletePaper(paper.id, e)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }} title="Delete">🗑</button>}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 16 }}>
                            <span>Branch: {paper.details.branch}</span> &nbsp;·&nbsp; <span>Sets: {paper.sets.length}</span>
                            {isAdmin && paper.createdBy && <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Created by: {paper.createdBy} {paper.isSample ? '(System)' : ''}</div>}
                          </div>
                          <div style={{ padding: '8px 12px', borderRadius: 8, textAlign: 'center', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 12, fontWeight: 700 }}>Load & Preview →</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <PageFooter />
            </div>
          </ProtectedRoute>
        } />

        {/* Preview View */}
        <Route path="/preview" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', background: 'linear-gradient(90deg, #1e1b4b, #312e81)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }} className="print:hidden">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button style={btn('rgba(107,114,128,0.7)')} onClick={() => navigate('/generator')}>← Back to Edit</button>
                  <button style={btn('rgba(107,114,128,0.7)')} onClick={() => navigate('/')}>Home</button>
                  <button style={btn('rgba(124,58,237,0.7)')} onClick={() => navigate('/history')}>Previous Papers</button>
                  <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                    {sets.map((set, index) => (
                      <button key={set.setName} onClick={() => setActiveSetIndex(index)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: activeSetIndex === index ? 'linear-gradient(90deg, #4338ca, #7c3aed)' : 'rgba(255,255,255,0.1)', color: activeSetIndex === index ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{set.setName}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btn('rgba(37,99,235,0.8)')} onClick={handleDownloadWord}>Word</button>
                  <button style={btn('rgba(29,78,216,0.8)')} onClick={handleDownloadAllWord}>All Word</button>
                  <button style={btn('rgba(220,38,38,0.8)')} onClick={handleDownloadPDF}>PDF</button>
                  <button style={btn('rgba(185,28,28,0.8)')} onClick={handleDownloadAllPDF}>All PDF</button>
                  <button onClick={handleShareWhatsApp} style={{ ...NAV_BTN, background: 'linear-gradient(90deg, #16a34a, #25d366)', display: 'flex', alignItems: 'center', gap: 6 }} title="Share via WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.07 1.5 5.786L0 24l6.381-1.474A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.576 9.576 0 01-4.885-1.34l-.35-.208-3.63.838.872-3.543-.228-.364A9.538 9.538 0 012.4 12c0-5.295 4.305-9.6 9.6-9.6 5.295 0 9.6 4.305 9.6 9.6 0 5.295-4.305 9.6-9.6 9.6z" /></svg>
                    WhatsApp
                  </button>
                  <button style={btn('rgba(22,163,74,0.8)')} onClick={() => window.print()}>Print</button>
                  <button style={btn('rgba(239,68,68,0.7)')} onClick={handleLogout}>Logout</button>
                </div>
              </div>
              <div style={{ paddingTop: 72 }}>
                {sets.length > 0 && <QuestionPaper details={details} set={sets[activeSetIndex]} />}
              </div>
              <div className="fixed top-[100vh] left-0 pointer-events-none opacity-0">
                {sets.map((set, index) => (
                  <QuestionPaper key={set.setName} details={details} set={set} id={`print-set-${index}`} />
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }} className="print:hidden">
                <PageFooter />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>

      {/* Global Panels */}
      <ChatBot />
      {showWAModal && <WhatsAppModal message={waMessage} onClose={() => setShowWAModal(false)} />}
    </>
  );
}

export default App;
