import { useState } from 'react';
import type { HRDocument } from '../../types/portal';

const CATEGORY_LABELS: Record<string, string> = {
  policy: 'Policy',
  benefit: 'Benefit',
  procedure: 'Procedure',
  form: 'Form',
  handbook: 'Handbook',
};

const CATEGORY_COLORS: Record<string, string> = {
  policy: 'bg-blue-100 text-blue-700',
  benefit: 'bg-green-100 text-green-700',
  procedure: 'bg-purple-100 text-purple-700',
  form: 'bg-orange-100 text-orange-700',
  handbook: 'bg-gray-100 text-gray-700',
};

interface HRDocumentsProps {
  documents: HRDocument[];
}

function renderMarkdown(text: string) {
  // Very simple markdown: handle **bold**, ## headings, - bullets, blank lines as paragraphs
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-sm font-bold text-portal-fg mt-4 mb-1">{line.slice(3)}</h3>;
      }
      if (line.startsWith('- ') || line.match(/^\d+\./)) {
        const content = line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '');
        return (
          <li key={i} className="text-xs text-portal-fg ml-3 list-disc">
            {formatBold(content)}
          </li>
        );
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-xs text-portal-fg">{formatBold(line)}</p>;
    });
}

function formatBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

export function HRDocuments({ documents }: HRDocumentsProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<HRDocument | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.includes(q));
    const matchesCategory = !activeCategory || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  if (selected) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-portal-muted hover:text-portal-fg mb-4 pt-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to documents
        </button>

        <div className="bg-portal-surface rounded-xl border border-portal-border p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[selected.category]}`}>
                {CATEGORY_LABELS[selected.category]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-portal-fg">{selected.title}</h2>
            <p className="text-xs text-portal-muted mt-1">
              Last updated: {new Date(selected.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-sm max-w-none space-y-1">
            {renderMarkdown(selected.content)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <div className="pt-2">
        <h2 className="text-xl font-bold text-portal-fg">HR Documents</h2>
        <p className="text-sm text-portal-muted">Policies, benefits, and procedures</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm placeholder-portal-muted focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !activeCategory ? 'bg-portal-primary text-white border-portal-primary' : 'bg-portal-surface text-portal-muted border-portal-border hover:text-portal-fg'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
              activeCategory === cat ? 'bg-portal-primary text-white border-portal-primary' : 'bg-portal-surface text-portal-muted border-portal-border hover:text-portal-fg'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Document list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-portal-muted text-center py-8">No documents match your search.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelected(doc)}
              className="w-full text-left bg-portal-surface rounded-xl border border-portal-border p-4 hover:border-portal-primary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-portal-bg flex items-center justify-center text-portal-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-portal-fg truncate">{doc.title}</p>
                    <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[doc.category]}`}>
                      {CATEGORY_LABELS[doc.category]}
                    </span>
                  </div>
                  <p className="text-xs text-portal-muted line-clamp-2">{doc.description}</p>
                </div>
                <svg className="w-4 h-4 text-portal-muted shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
