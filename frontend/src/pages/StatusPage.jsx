import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import { getCrawlStatus } from '../services/api';

function StatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('PENDING');
  const [pagesCrawled, setPagesCrawled] = useState(0);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const doneRef = useRef(false);

  const seedUrl = localStorage.getItem(`crawl-url-${id}`) ?? id;

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!doneRef.current) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Polling
  useEffect(() => {
    let pollInterval;

    const fetchStatus = async () => {
      try {
        const response = await getCrawlStatus(id);
        setStatus(response.status);
        setPagesCrawled(response.pagesCrawled);

        if (response.status === 'DONE' || response.status === 'COMPLETED') {
          doneRef.current = true;
          clearInterval(pollInterval);
          setTimeout(() => navigate(`/report/${id}`), 800);
        }

        if (response.status === 'FAILED') {
          doneRef.current = true;
          clearInterval(pollInterval);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch crawl status');
        clearInterval(pollInterval);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 2000);
    return () => clearInterval(pollInterval);
  }, [id, navigate]);

  const formatElapsed = (s) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

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
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F87171' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#F87171' }}>Crawl error</p>
              <p className="text-xs" style={{ color: '#FCA5A5' }}>{error}</p>
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="mt-4 text-sm transition-colors"
          style={{ color: '#64748B' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          ← Start new crawl
        </Link>
      </div>
    );
  }

  const isDone = status === 'DONE' || status === 'COMPLETED';
  const isFailed = status === 'FAILED';

  return (
    <div
      className="min-h-dvh px-6 py-10"
      style={{ paddingTop: 'calc(52px + 2.5rem)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={status} />
            </div>
            <p
              className="text-xs font-mono mt-2 max-w-sm truncate"
              style={{ color: '#64748B' }}
              title={seedUrl}
            >
              {seedUrl}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard
            label="Pages crawled"
            value={pagesCrawled}
            valueColor="#F1F5F9"
          />
          <StatCard
            label="Elapsed"
            value={formatElapsed(elapsed)}
            valueColor="#94A3B8"
          />
          <StatCard
            label="Max pages"
            value="500"
            valueColor="#475569"
            sublabel="per job"
          />
        </div>

        {/* CTA when done */}
        {isDone && (
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ backgroundColor: '#052E16', border: '1px solid #14532D' }}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: '#4ADE80' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: '#4ADE80' }}>
                Crawl complete — redirecting to report...
              </span>
            </div>
            <Link
              to={`/report/${id}`}
              className="text-xs font-medium px-3 py-1.5 rounded transition-colors"
              style={{ backgroundColor: '#22C55E', color: '#052E16' }}
            >
              View report →
            </Link>
          </div>
        )}

        {/* Failed state */}
        {isFailed && (
          <div
            className="rounded-lg p-4 flex items-center justify-between"
            style={{ backgroundColor: '#1F0A0A', border: '1px solid #7F1D1D' }}
          >
            <span className="text-sm" style={{ color: '#F87171' }}>
              Crawl failed. The target may be unreachable.
            </span>
            <Link
              to="/"
              className="text-xs font-medium px-3 py-1.5 rounded"
              style={{ backgroundColor: '#EF4444', color: '#fff' }}
            >
              Try again
            </Link>
          </div>
        )}

        {/* Running hint */}
        {!isDone && !isFailed && (
          <p className="text-xs text-center" style={{ color: '#475569' }}>
            Crawling in progress — this page polls automatically every 2s
          </p>
        )}
      </div>
    </div>
  );
}

export default StatusPage;
