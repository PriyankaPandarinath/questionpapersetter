import React, { useState } from 'react';
import type { Question, ExamDetails, QuestionBank } from '../types';
import { findRelevantQuestions } from '../utils/syllabusMatcher';

interface QuestionInputFormProps {
    details: ExamDetails;
    setDetails: React.Dispatch<React.SetStateAction<ExamDetails>>;
    mcqs: Question[];
    setMcqs: React.Dispatch<React.SetStateAction<Question[]>>;
    fibs: Question[];
    setFibs: React.Dispatch<React.SetStateAction<Question[]>>;
    partB: Question[];
    setPartB: React.Dispatch<React.SetStateAction<Question[]>>;
    onSubmit: () => void;
    questionBank?: QuestionBank;
}

// ── Dark-theme helpers ─────────────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#e0e7ff', fontSize: 13, outline: 'none',
};
const CARD: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '18px 20px', marginBottom: 12,
};

const QuestionInputForm: React.FC<QuestionInputFormProps> = ({
    details, setDetails, mcqs, setMcqs, fibs, setFibs, partB, setPartB, onSubmit, questionBank
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'mcq' | 'fib' | 'partB'>('details');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importType, setImportType] = useState<'mcq' | 'fib' | 'partB' | null>(null);
    const [importSubject, setImportSubject] = useState<string>('');
    const [selectedImportIds, setSelectedImportIds] = useState<number[]>([]);

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleMcqChange = (index: number, field: keyof Question, value: string | string[] | number) => {
        const n = [...mcqs]; n[index] = { ...n[index], [field]: value }; setMcqs(n);
    };
    const handleOptionChange = (qi: number, oi: number, value: string) => {
        const n = [...mcqs]; if (n[qi].options) n[qi].options![oi] = value; setMcqs(n);
    };
    const handleFibChange = (index: number, value: string) => {
        const n = [...fibs]; n[index].text = value; setFibs(n);
    };
    const handlePartBChange = (index: number, field: keyof Question, value: string | number) => {
        const n = [...partB]; n[index] = { ...n[index], [field]: value }; setPartB(n);
    };

    const fillDummyData = () => {
        setDetails({
            collegeName: "NALLA NARASIMHA REDDY EDUCATION SOCIETY'S GROUP OF INSTITUTIONS",
            examName: 'II B.TECH II SEMESTER – I MID TERM EXAMINATION –FEB-2026',
            subject: 'Database Management Systems', subjectCode: '22CS404PC',
            branch: 'COMMON TO (CSE, CSD, CSM & IT)', date: '20-02-2026 (A.N)',
            time: '2 Hours (1:30PM TO 3:30PM)', maxMarks: 30,
        });
        setMcqs(mcqs.map((q, i) => ({ ...q, text: `MCQ Question ${i + 1}`, options: ['Option A', 'Option B', 'Option C', 'Option D'] })));
        setFibs(fibs.map((q, i) => ({ ...q, text: `FIB Question ${i + 1}` })));
        setPartB(partB.map((q, i) => ({ ...q, text: `Part B Question ${i + 1}`, bloomLevel: `L${(i % 3) + 2}, CO-${(i % 2) + 1}` })));
    };

    const handleAutoFillSyllabus = () => {
        if (!questionBank || !details.subject) { alert('Please enter a Subject Name matching a subject in your Question Bank.'); return; }
        const subjectData = questionBank[details.subject];
        if (!subjectData) { alert(`Subject "${details.subject}" not found in Question Bank.`); return; }
        const syllabus = subjectData.syllabus || '';
        setMcqs(mcqs.map((q, i) => { const r = findRelevantQuestions(subjectData.mcqs, syllabus, 10); return i < r.length ? { ...q, text: r[i].text, options: r[i].options || q.options } : q; }));
        setFibs(fibs.map((q, i) => { const r = findRelevantQuestions(subjectData.fibs, syllabus, 10); return i < r.length ? { ...q, text: r[i].text } : q; }));
        setPartB(partB.map((q, i) => { const r = findRelevantQuestions(subjectData.partB, syllabus, 6); return i < r.length ? { ...q, text: r[i].text, bloomLevel: r[i].bloomLevel, marks: r[i].marks } : q; }));
        alert(`Auto-filled questions for ${details.subject} based on syllabus relevance!`);
    };

    const TABS = [
        { key: 'details', label: '📋 Details' },
        { key: 'mcq', label: '🔵 MCQ' },
        { key: 'fib', label: '📝 FIB' },
        { key: 'partB', label: '📖 Part B' },
    ];

    return (
        <div style={{ padding: '24px 28px' }}>
            {/* Tab bar + action buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key as 'details' | 'mcq' | 'fib' | 'partB')}
                        style={{
                            padding: '8px 18px', borderRadius: 9, border: 'none',
                            background: activeTab === t.key
                                ? 'linear-gradient(90deg, #4338ca, #7c3aed)'
                                : 'rgba(255,255,255,0.07)',
                            color: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            boxShadow: activeTab === t.key ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                            transition: 'all 0.15s',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button
                        onClick={fillDummyData}
                        style={{ padding: '8px 16px', borderRadius: 9, border: 'none', background: 'rgba(234,179,8,0.3)', color: '#fde68a', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                        Fill Dummy Data
                    </button>
                    <button
                        onClick={handleAutoFillSyllabus}
                        style={{ padding: '8px 16px', borderRadius: 9, border: 'none', background: 'rgba(124,58,237,0.35)', color: '#c4b5fd', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                        title="Fill questions from Bank based on Syllabus relevance"
                    >
                        Auto-Fill (Syllabus)
                    </button>
                    <button
                        onClick={onSubmit}
                        style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: 'linear-gradient(90deg, #059669, #10b981)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}
                    >
                        ⚡ Generate Sets
                    </button>
                </div>
            </div>

            {/* Content panel */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px' }}>

                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {Object.keys(details).map(key => (
                            <div key={key}>
                                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                    type="text"
                                    name={key}
                                    value={details[key as keyof ExamDetails]}
                                    onChange={handleDetailChange}
                                    style={{ ...INPUT_STYLE, marginTop: 6 }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* MCQ TAB */}
                {activeTab === 'mcq' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h2 style={{ color: '#e0e7ff', fontSize: 17, fontWeight: 700, margin: 0 }}>Part A: Multiple Choice Questions (10)</h2>
                            <button
                                onClick={() => { setImportType('mcq'); setShowImportModal(true); setImportSubject(''); setSelectedImportIds([]); }}
                                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(99,102,241,0.4)', color: '#c7d2fe', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                            >
                                Import from Bank
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {mcqs.map((q, i) => (
                                <div key={q.id} style={CARD}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                                        <span style={{ color: '#818cf8', fontWeight: 800, fontSize: 14, minWidth: 24 }}>{i + 1}.</span>
                                        <input
                                            type="text" value={q.text}
                                            onChange={e => handleMcqChange(i, 'text', e.target.value)}
                                            style={INPUT_STYLE} placeholder="Question Text"
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginLeft: 34 }}>
                                        {q.options?.map((opt, oi) => (
                                            <input
                                                key={oi} type="text" value={opt}
                                                onChange={e => handleOptionChange(i, oi, e.target.value)}
                                                style={{ ...INPUT_STYLE, fontSize: 12 }}
                                                placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FIB TAB */}
                {activeTab === 'fib' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h2 style={{ color: '#e0e7ff', fontSize: 17, fontWeight: 700, margin: 0 }}>Part A: Fill in the Blanks (10)</h2>
                            <button
                                onClick={() => { setImportType('fib'); setShowImportModal(true); setImportSubject(''); setSelectedImportIds([]); }}
                                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(99,102,241,0.4)', color: '#c7d2fe', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                            >
                                Import from Bank
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {fibs.map((q, i) => (
                                <div key={q.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{ color: '#818cf8', fontWeight: 800, fontSize: 14, minWidth: 36 }}>{i + 11}.</span>
                                    <input
                                        type="text" value={q.text}
                                        onChange={e => handleFibChange(i, e.target.value)}
                                        style={INPUT_STYLE} placeholder="Question Text"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PART B TAB */}
                {activeTab === 'partB' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h2 style={{ color: '#e0e7ff', fontSize: 17, fontWeight: 700, margin: 0 }}>Part B: Long Answer Questions (6)</h2>
                            <button
                                onClick={() => { setImportType('partB'); setShowImportModal(true); setImportSubject(''); setSelectedImportIds([]); }}
                                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(99,102,241,0.4)', color: '#c7d2fe', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                            >
                                Import from Bank
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {partB.map((q, i) => (
                                <div key={q.id} style={CARD}>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <span style={{ color: '#818cf8', fontWeight: 800, fontSize: 14, minWidth: 24, paddingTop: 2 }}>{i + 1}.</span>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <input
                                                type="text" value={q.bloomLevel}
                                                onChange={e => handlePartBChange(i, 'bloomLevel', e.target.value)}
                                                style={{ ...INPUT_STYLE, width: '50%' }}
                                                placeholder="Bloom's Level / CO"
                                            />
                                            <textarea
                                                value={q.text}
                                                onChange={e => handlePartBChange(i, 'text', e.target.value)}
                                                style={{ ...INPUT_STYLE, resize: 'vertical', fontFamily: 'inherit' } as React.CSSProperties}
                                                placeholder="Question Text" rows={2}
                                            />
                                            <input
                                                type="number" value={q.marks}
                                                onChange={e => handlePartBChange(i, 'marks', Number(e.target.value))}
                                                style={{ ...INPUT_STYLE, width: 90 }}
                                                placeholder="Marks"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            {showImportModal && questionBank && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 20 }}>
                    <div style={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, width: '100%', maxWidth: 600, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
                        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: '#e0e7ff', fontWeight: 800, fontSize: 16, margin: 0 }}>Import {importType?.toUpperCase()} from Question Bank</h3>
                            <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Select Subject</label>
                            <select
                                value={importSubject}
                                onChange={e => { setImportSubject(e.target.value); setSelectedImportIds([]); }}
                                style={{ ...INPUT_STYLE, marginTop: 6 }}
                            >
                                <option value="" style={{ background: '#1e1b4b' }}>-- Select Subject --</option>
                                {Object.keys(questionBank).map(s => (
                                    <option key={s} value={s} style={{ background: '#1e1b4b' }}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
                            {!importSubject ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 30 }}>Select a subject to see questions.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {(() => {
                                        const questions = (questionBank[importSubject][importType! + 's' as keyof import('../types').SubjectData] ||
                                            questionBank[importSubject][importType as keyof import('../types').SubjectData]) as Question[];
                                        if (!questions || questions.length === 0)
                                            return <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No questions found.</p>;
                                        return questions.map((q: Question) => (
                                            <div key={q.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: selectedImportIds.includes(q.id) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedImportIds.includes(q.id) ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer' }}
                                                onClick={() => setSelectedImportIds(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])}>
                                                <input type="checkbox" checked={selectedImportIds.includes(q.id)} onChange={() => { }} style={{ marginTop: 3 }} />
                                                <div>
                                                    <p style={{ color: '#e0e7ff', margin: 0, fontSize: 13, fontWeight: 500 }}>{q.text}</p>
                                                    {q.options && <p style={{ color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', fontSize: 11 }}>{q.options.join(' · ')}</p>}
                                                    {q.bloomLevel && <p style={{ color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', fontSize: 11 }}>Bloom: {q.bloomLevel} | Marks: {q.marks}</p>}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button onClick={() => setShowImportModal(false)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                            <button
                                onClick={() => {
                                    if (!importSubject || !importType) return;
                                    const subjectData = questionBank[importSubject];
                                    const src = (subjectData[importType === 'partB' ? 'partB' : (importType + 's' as keyof typeof subjectData)]) as Question[];
                                    const sel = src.filter((q: Question) => selectedImportIds.includes(q.id));
                                    if (importType === 'mcq') { 
                                        setMcqs(prev => {
                                            const n = [...prev];
                                            sel.forEach((q: Question) => {
                                                const emptyIdx = n.findIndex(mq => !mq.text);
                                                if (emptyIdx !== -1) n[emptyIdx] = { ...n[emptyIdx], text: q.text, options: [...(q.options || [])] };
                                                else n.push({ ...q, id: n.length + 1 });
                                            });
                                            return n;
                                        });
                                    }
                                    else if (importType === 'fib') {
                                        setFibs(prev => {
                                            const n = [...prev];
                                            sel.forEach((q: Question) => {
                                                const emptyIdx = n.findIndex(fq => !fq.text);
                                                if (emptyIdx !== -1) n[emptyIdx] = { ...n[emptyIdx], text: q.text };
                                                else n.push({ ...q, id: n.length + 1 });
                                            });
                                            return n;
                                        });
                                    }
                                    else if (importType === 'partB') {
                                        setPartB(prev => {
                                            const n = [...prev];
                                            sel.forEach((q: Question) => {
                                                const emptyIdx = n.findIndex(pq => !pq.text);
                                                if (emptyIdx !== -1) n[emptyIdx] = { ...n[emptyIdx], text: q.text, bloomLevel: q.bloomLevel, marks: q.marks };
                                                else n.push({ ...q, id: n.length + 1 });
                                            });
                                            return n;
                                        });
                                    }
                                    setShowImportModal(false);
                                }}
                                disabled={selectedImportIds.length === 0}
                                style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: selectedImportIds.length === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(90deg, #059669, #10b981)', color: selectedImportIds.length === 0 ? 'rgba(255,255,255,0.3)' : '#fff', fontWeight: 700, cursor: selectedImportIds.length === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                Import {selectedImportIds.length} Questions
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }`}</style>
        </div>
    );
};

export default QuestionInputForm;
