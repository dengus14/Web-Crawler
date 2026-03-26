import { useState } from 'react';
import CodeBadge from './CodeBadge';
import EmptyState from './EmptyState';

// ─── Broken Links ────────────────────────────────────────────────────────────

function BrokenLinksTable({ rows }) {
  const [sort, setSort] = useState({ col: 'statusCode', dir: 'desc' });

  const sorted = [...rows].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    if (sort.col === 'statusCode') return (a.statusCode - b.statusCode) * dir;
    if (sort.col === 'responseTimeMs') return (a.responseTimeMs - b.responseTimeMs) * dir;
    return a.url.localeCompare(b.url) * dir;
  });

  const toggleSort = (col) =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));

  if (!rows.length)
    return <EmptyState title="No broken links found" description="All pages returned a successful status code." />;

  return (
    <Table>
      <thead>
        <Tr header>
          <Th onClick={() => toggleSort('url')} sort={sort} col="url">URL</Th>
          <Th onClick={() => toggleSort('statusCode')} sort={sort} col="statusCode" right>Status</Th>
          <Th onClick={() => toggleSort('responseTimeMs')} sort={sort} col="responseTimeMs" right>Response</Th>
        </Tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <Tr key={r.id ?? r.url}>
            <Td>
              <UrlCell url={r.url} />
            </Td>
            <Td right><CodeBadge code={r.statusCode} /></Td>
            <Td right><ResponseTime ms={r.responseTimeMs} /></Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

// ─── SEO Issues ──────────────────────────────────────────────────────────────

const SEO_CHECKS = [
  { key: 'missingTitle',   label: 'Missing title',        test: (p) => !p.title || p.title.trim() === '' },
  { key: 'longTitle',      label: 'Title too long (>60)', test: (p) => p.title?.length > 60 },
  { key: 'noMeta',         label: 'Missing meta description', test: (p) => !p.metaDescription || p.metaDescription.trim() === '' },
  { key: 'noH1',           label: 'Missing H1',           test: (p) => !p.hasH1 },
];

function SeoIssuesTable({ rows }) {
  if (!rows.length)
    return <EmptyState title="No SEO issues found" description="All crawled pages passed the SEO checks." />;

  return (
    <Table>
      <thead>
        <Tr header>
          <Th>URL</Th>
          <Th>Issues</Th>
          <Th right>Status</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const issues = SEO_CHECKS.filter((c) => c.test(r)).map((c) => c.label);
          return (
            <Tr key={r.id ?? r.url}>
              <Td><UrlCell url={r.url} /></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {issues.map((label) => (
                    <span
                      key={label}
                      className="px-2 py-0.5 rounded text-xs font-mono"
                      style={{ backgroundColor: '#431407', color: '#FCD34D' }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </Td>
              <Td right><CodeBadge code={r.statusCode} /></Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}

// ─── Slow Pages ──────────────────────────────────────────────────────────────

function SlowPagesTable({ rows }) {
  const [sort, setSort] = useState({ col: 'responseTimeMs', dir: 'desc' });

  const sorted = [...rows].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    if (sort.col === 'responseTimeMs') return (a.responseTimeMs - b.responseTimeMs) * dir;
    if (sort.col === 'statusCode') return (a.statusCode - b.statusCode) * dir;
    return a.url.localeCompare(b.url) * dir;
  });

  const toggleSort = (col) =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));

  if (!rows.length)
    return (
      <EmptyState
        title="No slow pages detected"
        description="Slow pages are the top 10% by response time. At least 10 pages must be crawled."
      />
    );

  return (
    <Table>
      <thead>
        <Tr header>
          <Th onClick={() => toggleSort('url')} sort={sort} col="url">URL</Th>
          <Th onClick={() => toggleSort('responseTimeMs')} sort={sort} col="responseTimeMs" right>Response time</Th>
          <Th onClick={() => toggleSort('statusCode')} sort={sort} col="statusCode" right>Status</Th>
        </Tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <Tr key={r.id ?? r.url}>
            <Td><UrlCell url={r.url} /></Td>
            <Td right><ResponseTime ms={r.responseTimeMs} /></Td>
            <Td right><CodeBadge code={r.statusCode} /></Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

// ─── Duplicates ──────────────────────────────────────────────────────────────

function DuplicatesTable({ rows }) {
  if (!rows.length)
    return <EmptyState title="No duplicate pages found" description="No pages had similar content based on SimHash analysis." />;

  return (
    <Table>
      <thead>
        <Tr header>
          <Th>URL</Th>
          <Th right>Status</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Tr key={r.id ?? r.url}>
            <Td><UrlCell url={r.url} /></Td>
            <Td right><CodeBadge code={r.statusCode} /></Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

// ─── Shared primitives ───────────────────────────────────────────────────────

function Table({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

function Tr({ children, header }) {
  return (
    <tr
      style={
        header
          ? { borderBottom: '1px solid #2D3A52' }
          : { borderBottom: '1px solid #1E293B' }
      }
      className={header ? '' : 'hover:bg-[#1E293B] transition-colors'}
    >
      {children}
    </tr>
  );
}

function Th({ children, onClick, sort, col, right }) {
  const isActive = sort?.col === col;
  return (
    <th
      onClick={onClick}
      className={`py-2.5 px-4 text-left text-xs font-medium uppercase tracking-wider select-none ${onClick ? 'cursor-pointer' : ''} ${right ? 'text-right' : ''}`}
      style={{ color: isActive ? '#94A3B8' : '#64748B' }}
    >
      {children}
      {isActive && (
        <span className="ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );
}

function Td({ children, right }) {
  return (
    <td className={`py-2.5 px-4 ${right ? 'text-right' : ''}`} style={{ color: '#94A3B8' }}>
      {children}
    </td>
  );
}

function UrlCell({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs hover:underline max-w-xs lg:max-w-lg xl:max-w-2xl truncate block"
      style={{ color: '#60A5FA' }}
      title={url}
    >
      {url}
    </a>
  );
}

function ResponseTime({ ms }) {
  let color;
  if (ms < 500)       color = '#4ADE80';
  else if (ms < 1000) color = '#FCD34D';
  else                color = '#F87171';

  return (
    <span className="font-mono text-xs" style={{ color }}>
      {ms}ms
    </span>
  );
}

// ─── Named export used by ReportPage ─────────────────────────────────────────

export { BrokenLinksTable, SeoIssuesTable, SlowPagesTable, DuplicatesTable };
