import { useState, useRef, useEffect } from 'react';
import type { HRDocument } from '../../types/portal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function findAnswerInDocuments(question: string, documents: HRDocument[]): string {
  const q = question.toLowerCase();

  // Find relevant documents by keyword matching
  const scored = documents
    .map((doc) => {
      let score = 0;
      const combined = (doc.title + ' ' + doc.description + ' ' + doc.tags.join(' ') + ' ' + doc.content).toLowerCase();
      // Score each matching word
      q.split(/\s+/)
        .filter((w) => w.length > 2)
        .forEach((word) => {
          if (combined.includes(word)) score += 1;
          if (doc.title.toLowerCase().includes(word)) score += 2;
          if (doc.tags.some((t) => t.includes(word))) score += 2;
        });
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return "I couldn't find a specific policy that answers your question. Please check the HR Documents section or contact your HR Business Partner for personalised advice.";
  }

  const best = scored[0].doc;

  // Extract relevant section from document content
  const lines = best.content.split('\n').filter((l) => l.trim());
  const relevantLines: string[] = [];
  let foundRelevant = false;

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    const hasKeyword = q
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .some((word) => lineLower.includes(word));
    if (hasKeyword || foundRelevant) {
      relevantLines.push(line.replace(/\*\*/g, '').replace(/^##\s*/, '').replace(/^-\s*/, '• '));
      foundRelevant = true;
      if (relevantLines.length >= 6) break;
    }
  }

  const excerpt = relevantLines.length > 0
    ? relevantLines.join('\n')
    : lines.slice(0, 5).map(l => l.replace(/\*\*/g, '').replace(/^##\s*/, '').replace(/^-\s*/, '• ')).join('\n');

  return `Based on the **${best.title}**:\n\n${excerpt}\n\nFor full details, see the HR Documents section.`;
}

const SUGGESTIONS = [
  'How many days of annual leave do I get?',
  'What is the remote work policy?',
  'How do I report sick leave?',
  'What benefits do I receive?',
  'How is performance reviewed?',
  'What is the code of conduct?',
];

interface PolicyQAProps {
  documents: HRDocument[];
}

export function PolicyQA({ documents }: PolicyQAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi! I can answer questions about HR policies and benefits. Try asking about leave entitlements, remote work, performance reviews, or any other HR topic.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const msgCounterRef = useRef(0);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    msgCounterRef.current += 1;
    const userMsgId = `u${msgCounterRef.current}`;
    const userMsg: Message = { id: userMsgId, role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate async response
    setTimeout(() => {
      msgCounterRef.current += 1;
      const answer = findAnswerInDocuments(text, documents);
      const assistantMsg: Message = { id: `a${msgCounterRef.current}`, role: 'assistant', text: answer };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function renderText(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="block font-semibold">{line.slice(2, -2)}</strong>;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formatted = parts.map((p, j) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={j}>{p.slice(2, -2)}</strong>
          : p
      );
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{formatted}</p>;
    });
  }

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-portal-border shrink-0">
        <div className="pt-2">
          <h2 className="text-xl font-bold text-portal-fg">Policy Q&amp;A</h2>
          <p className="text-sm text-portal-muted">Ask questions about HR policies</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Suggestions (only shown when just welcome message) */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-portal-muted">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-portal-surface border border-portal-border text-portal-fg px-3 py-1.5 rounded-full hover:border-portal-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-1 ${
                msg.role === 'user'
                  ? 'bg-portal-primary text-white rounded-br-sm'
                  : 'bg-portal-surface border border-portal-border text-portal-fg rounded-bl-sm'
              }`}
            >
              {renderText(msg.text)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-portal-surface border border-portal-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-portal-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-portal-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-portal-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-portal-border shrink-0 bg-portal-surface">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any HR policy..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-portal-border bg-portal-input text-portal-fg text-sm placeholder-portal-muted focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-portal-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-portal-primary-hover transition-colors disabled:opacity-50 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
