import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import {
  BrokenLinksTable,
  SeoIssuesTable,
  SlowPagesTable,
  DuplicatesTable,
} from '../components/ReportTable';
import { getCrawlReport } from '../services/api';

const TABS = [
  { id: 'broken',     label: 'Broken Links',    key: 'brokenLinks'    },
  { id: 'seo',        label: 'SEO Issues',      key: 'seoIssues'      },
  { id: 'slow',       label: 'Slow Pages',      key: 'slowPages'      },
  { id: 'duplicates', label: 'Duplicates',      key: 'duplicatePages' },
];

function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('broken');

  const seedUrl = localStorage.getItem(`crawl-url-${id}`) ?? id;

  useEffect(() => {
    getCrawlReport(id)
      .then((data) => setReport(data))
      .catch((err) =>
        setError(err.response?.data?.message || err.message || 'Failed to load report')
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ paddingTop: '52px' }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-6 h-6" style={{ color: '#2563EB' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs" style={{ color: '#64748B' }}>Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-6"
        style={{ paddingTop: '52px' }}
      >
        <div
          className="w-full max-w-md rounded-lg p-5"
          style={{ backgroundColor: '#1F0A0A', border: '1px solid #7F1D1D' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: '#F87171' }}>Failed to load report</p>
          <p className="text-xs" style={{ color: '#FCA5A5' }}>{error}</p>
          <p className="text-xs mt-3" style={{ color: '#64748B' }}>
            The crawl may still be in progress.{' '}
            <Link to={`/status/${id}`} style={{ color: '#60A5FA' }}>
              Check status →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const broken     = report?.brokenLinks    ?? [];
  const seo        = report?.seoIssues      ?? [];
  const slow       = report?.slowPages      ?? [];
  const duplicates = report?.duplicatePages ?? [];

  const counts = { broken: broken.length, seo: seo.length, slow: slow.length, duplicates: duplicates.length };
  const total  = broken.length + seo.length + slow.length + duplicates.length;

  return (
    <div style={{ paddingTop: '52px' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="mb-6">
          <p
            className="text-xs font-mono mb-1 truncate"
            style={{ color: '#64748B' }}
            title={seedUrl}
          >
            {seedUrl}
          </p>
          <h1 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
            Audit Report
          </h1>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Broken links"
            value={broken.length}
            valueColor={broken.length > 0 ? '#F87171' : '#4ADE80'}
          />
          <StatCard
            label="SEO issues"
            value={seo.length}
            valueColor={seo.length > 0 ? '#FCD34D' : '#4ADE80'}
          />
          <StatCard
            label="Slow pages"
            value={slow.length}
            valueColor={slow.length > 0 ? '#FCD34D' : '#4ADE80'}
            sublabel="top 10% by response time"
          />
          <StatCard
            label="Duplicates"
            value={duplicates.length}
            valueColor={duplicates.length > 0 ? '#FCD34D' : '#4ADE80'}
          />
        </div>

        {/* All-clear banner */}
        {total === 0 && (
          <div
            className="rounded-lg p-4 flex items-center gap-3 mb-6"
            style={{ backgroundColor: '#052E16', border: '1px solid #14532D' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" style={{ color: '#4ADE80' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm" style={{ color: '#4ADE80' }}>
              No issues found — this site passed all checks.
            </p>
          </div>
        )}

        {/* Tab bar */}
        <div
          className="flex gap-0 mb-0 overflow-x-auto"
          style={{ borderBottom: '1px solid #2D3A52' }}
        >
          {TABS.map((tab) => {
            const count = counts[tab.id];
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors"
                style={{
                  color: active ? '#F1F5F9' : '#64748B',
                  borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-mono"
                  style={{
                    backgroundColor: active ? '#1E3A5F' : '#1B2336',
                    color: active ? '#60A5FA' : '#475569',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table panel */}
        <div
          className="rounded-b-lg rounded-tr-lg min-h-[200px]"
          style={{ backgroundColor: '#1B2336', border: '1px solid #2D3A52', borderTop: 'none' }}
        >
          {activeTab === 'broken'     && <BrokenLinksTable rows={broken}     />}
          {activeTab === 'seo'        && <SeoIssuesTable   rows={seo}         />}
          {activeTab === 'slow'       && <SlowPagesTable   rows={slow}        />}
          {activeTab === 'duplicates' && <DuplicatesTable  rows={duplicates}  />}
        </div>

      </div>
    </div>
  );
}

export default ReportPage;
