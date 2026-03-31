import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const QUICK_REPLIES = [
    'How do I add questions?',
    'What is the Question Bank?',
    "What are Bloom's Levels?",
    'How do I download a paper?',
    'How does shuffling work?',
    'How do I print?',
];

function getBotResponse(input: string): string {
    const msg = input.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy)/.test(msg)) {
        return "Hello! 👋 I'm your Question Paper Assistant. How can I help you today? You can ask me about adding questions, the Question Bank, Bloom's levels, downloading papers, and more!";
    }

    // Help
    if (/\bhelp\b/.test(msg)) {
        return "I can help you with:\n• Adding MCQs, Fill-in-the-Blanks, or Part B questions\n• Using the Question Bank\n• Bloom's Taxonomy levels\n• Generating, downloading, or printing papers\n• Understanding how question shuffling works\n\nJust ask!";
    }

    // Adding questions
    if (/add(ing)?\s+(question|mcq|fib|fill|part b|part-b|partb)/.test(msg) || /how (do|to|can).*(add|enter|type|input).*question/.test(msg) || msg.includes('how do i add')) {
        return "To add questions:\n\n**MCQs (Part A1):** Fill in the question text and 4 answer options in each row. There are 10 MCQ slots.\n\n**Fill-in-the-Blanks (FIB - Part A2):** Type each statement in the FIB slots. There are 10 FIB slots.\n\n**Part B:** Enter longer questions with Bloom's Level and marks in the Part B section. There are 6 slots.\n\nTip: Use the Question Bank to save and reuse questions across papers! 📚";
    }

    // Question Bank
    if (/question bank|bank/.test(msg)) {
        return "The **Question Bank** stores your questions by subject so you can reuse them later.\n\n• Click **'Question Bank'** button (top-right on the Input page) to open it.\n• Add subjects and their MCQs, FIBs, and Part B questions.\n• When creating a new paper, questions from the bank for the selected subject are shown, so you can copy them in.\n\nIt's a great time-saver! ⏱️";
    }

    // Bloom's levels
    if (/bloom|cognitive|l1|l2|l3|l4|l5|l6|remember|understand|apply|analys|evaluat|creat/.test(msg)) {
        return "**Bloom's Taxonomy Levels:**\n\n• **L1** – Remember (recall facts)\n• **L2** – Understand (explain ideas)\n• **L3** – Apply (use knowledge)\n• **L4** – Analyse (draw connections)\n• **L5** – Evaluate (justify decisions)\n• **L6** – Create (produce new work)\n\nYou assign these to Part B questions along with Course Outcomes (e.g., CO-1, CO-2) to indicate the cognitive level tested.";
    }

    // Course outcomes
    if (/\bco\b|course outcome/.test(msg)) {
        return "**Course Outcomes (CO)** are specific skills or knowledge a student should demonstrate after completing the course.\n\nIn Part B questions, you set a CO tag (e.g., CO-1, CO-2) along with the Bloom's level to map each question to the course curriculum. This helps in accreditation and quality assurance.";
    }

    // Shuffling / Sets
    if (/shuffle|shuffl|set[s]?|scrambl|randomiz|mix|rearrange/.test(msg)) {
        return "When you click **'Generate Paper'**, the app automatically creates **4 different Sets** (Set A, B, C, D).\n\nFor each set:\n• **MCQs** are shuffled in a different order.\n• **FIBs** are shuffled in a different order.\n• **Part B** questions remain fixed but options within MCQs are also shuffled.\n\nThis prevents copying between students sitting different sets. 🔀";
    }

    // Generating the paper
    if (/generat|creat.*paper|make.*paper|build.*paper/.test(msg)) {
        return "To generate a question paper:\n\n1. Fill in the **Exam Details** at the top (college, subject, date, etc.).\n2. Enter your **MCQ**, **FIB**, and **Part B** questions.\n3. Click the **'Generate Paper'** button at the bottom.\n4. You'll be taken to the **Preview** screen with 4 shuffled sets!";
    }

    // Download Word
    if (/word|docx|\.doc|microsoft/.test(msg)) {
        return "To download a Word document:\n\n• In the **Preview** view, click **'Word'** to download the currently selected set.\n• Click **'All Word'** to download all 4 sets as separate Word documents.\n\nThe documents are formatted and ready to print! 📄";
    }

    // Download PDF
    if (/pdf|download.*pdf|export.*pdf/.test(msg)) {
        return "To download a PDF:\n\n• In the **Preview** view, click **'PDF'** to download the currently selected set.\n• Click **'All PDF'** to download all 4 sets as separate PDF files.\n\nPerfect for digital distribution or archiving! 📥";
    }

    // Download general
    if (/download|export|save (as|to|the)/.test(msg)) {
        return "You can download question papers in two formats from the **Preview** view:\n\n• **Word (.docx)** – editable format, great for future editing.\n• **PDF** – fixed format, ideal for printing and sharing.\n\nBoth are available for the current set and for all sets at once!";
    }

    // Print
    if (/print/.test(msg)) {
        return "To print a question paper:\n\n1. Go to **Preview** view after generating.\n2. Select the Set (A, B, C, or D) you want to print.\n3. Click the **'Print Set'** button.\n4. Your browser's print dialog will open — choose your printer and settings.\n\nTip: The page is formatted for A4 size printing. 🖨️";
    }

    // Previous papers / History
    if (/history|previous|past.*paper|saved.*paper|paper.*history/.test(msg)) {
        return "The **Previous Papers** section saves every paper you generate automatically.\n\n• Click **'Previous Papers'** in the navigation bar to view them.\n• Click on any saved paper to load it back into the Preview.\n• You can also delete old papers using the trash icon. 🗑️";
    }

    // Login / logout
    if (/login|log in|logout|log out|sign in|sign out|password|credential/.test(msg)) {
        return "The app uses a simple login to protect your work.\n\n• Enter your **username** and **password** on the Login page to get started.\n• Click **'Logout'** (top-right) to securely log out.\n• Your question bank and paper history are stored in your browser's local storage.";
    }

    // Exam details
    if (/exam detail|college name|subject code|branch|date|time|max mark/.test(msg)) {
        return "The **Exam Details** section at the top of the Input page captures:\n\n• College Name\n• Exam Name\n• Subject & Subject Code\n• Branch\n• Date & Time\n• Max Marks\n\nThese appear in the header of every generated question paper set.";
    }

    // Parts
    if (/part a|part-a|parta/.test(msg)) {
        return "**Part A** has two sub-sections:\n\n• **Part A1** – Multiple Choice Questions (MCQs): 10 questions, each with 4 options.\n• **Part A2** – Fill in the Blanks (FIBs): 10 questions, one blank each.\n\nAll Part A questions are shuffled differently across the 4 sets.";
    }

    if (/part b|part-b|partb/.test(msg)) {
        return "**Part B** contains descriptive/long-answer questions.\n\n• There are 6 Part B question slots.\n• Each question has a **Bloom's Level** (e.g., L2), **Course Outcome** (e.g., CO-1), and **Marks** value.\n• Part B questions are not shuffled — they appear in the same order across all sets.";
    }

    // Thank you
    if (/thank|thanks|great|awesome|perfect|nice|helpful/.test(msg)) {
        return "You're welcome! 😊 Happy to help. Feel free to ask anything else about using the Question Paper Setter.";
    }

    // Bye
    if (/bye|goodbye|see you|that'?s? (all|it)|nothing else|no more|done|close/.test(msg)) {
        return "Goodbye! 👋 Good luck with your question paper! Feel free to reopen the chat anytime you need help.";
    }

    // Fallback
    return "I'm not sure about that specific question. Here are some things I can help with:\n\n• Adding MCQs, FIBs, or Part B questions\n• Using the Question Bank\n• Bloom's Taxonomy levels & Course Outcomes\n• Generating, downloading (Word/PDF), or printing papers\n• Understanding shuffled sets & question history\n\nTry rephrasing your question, or use the quick-reply buttons below! 💬";
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(() => [
        {
            id: 1,
            text: "Hi! I'm your Question Paper Assistant 🎓 How can I help you today? Ask me anything about creating question papers, or tap a quick-reply below!",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, messages]);

    const sendMessage = useCallback((text: string) => {
        if (!text.trim()) return;

        const msgId = Date.now();
        const userMsg: Message = {
            id: msgId,
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsgId = Date.now() + 1;
            const botMsg: Message = {
                id: botMsgId,
                text: getBotResponse(text),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 600);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') sendMessage(inputText);
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderMessageText = (text: string) => {
        // Convert **bold** and bullet points to styled spans
        return text.split('\n').map((line, i) => {
            const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return (
                <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formatted }} />
            );
        });
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 flex flex-col"
                    style={{
                        width: '360px',
                        height: '520px',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        animation: 'chatSlideUp 0.25s ease-out',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                            borderRadius: '20px 20px 0 0',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 20,
                                flexShrink: 0,
                            }}
                        >
                            🎓
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Paper Assistant</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                                Always here to help
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
                            title="Close"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(255,255,255,0.2) transparent',
                        }}
                    >
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        padding: '10px 14px',
                                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        background: msg.sender === 'user'
                                            ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                                            : 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        fontSize: 13.5,
                                        lineHeight: 1.55,
                                        backdropFilter: 'blur(8px)',
                                        border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    }}
                                >
                                    {renderMessageText(msg.text)}
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 3, marginLeft: 4, marginRight: 4 }}>
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div
                                    style={{
                                        padding: '10px 16px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '18px 18px 18px 4px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        gap: 5,
                                        alignItems: 'center',
                                    }}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', animation: 'bounce 1.2s infinite 0s' }} />
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', animation: 'bounce 1.2s infinite 0.2s' }} />
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc', animation: 'bounce 1.2s infinite 0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Replies */}
                    <div
                        style={{
                            padding: '6px 14px 8px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        {QUICK_REPLIES.slice(0, 4).map(qr => (
                            <button
                                key={qr}
                                onClick={() => sendMessage(qr)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    border: '1px solid rgba(165,180,252,0.4)',
                                    background: 'rgba(99,102,241,0.2)',
                                    color: '#c7d2fe',
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.5)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.2)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#c7d2fe';
                                }}
                            >
                                {qr}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: '10px 14px 14px',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 25,
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                fontSize: 13,
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={() => sendMessage(inputText)}
                            disabled={!inputText.trim()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: 'none',
                                background: inputText.trim() ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'background 0.2s',
                            }}
                            title="Send"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    border: 'none',
                    background: isOpen
                        ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                        : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#fff',
                    fontSize: 24,
                    cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(79,70,229,0.55)',
                    zIndex: 51,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(79,70,229,0.7)';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(79,70,229,0.55)';
                }}
                title={isOpen ? 'Close Chat' : 'Open Chat Assistant'}
            >
                {isOpen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* CSS Animations */}
            <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
      `}</style>
        </>
    );
}
