import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrawlInput from '../components/CrawlInput';
import { startCrawl } from '../services/api';

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
      </svg>
    ),
    label: 'BFS multi-threaded crawl',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    label: 'Broken link detection',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    label: 'SEO issue analysis',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
      </svg>
    ),
    label: 'Duplicate page detection',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (url) => {
    setLoading(true);
    setError('');
    try {
      const response = await startCrawl(url);
      const jobId = response.jobId || response.id || response;
      localStorage.setItem(`crawl-url-${jobId}`, url);
      navigate(`/status/${jobId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to start crawl. Please check the URL and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-dot-grid min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ paddingTop: '52px' }}
    >
      <div className="w-full max-w-lg text-center">
        <h1
          className="font-mono text-3xl font-semibold mb-2 tracking-tight"
          style={{ color: '#F1F5F9' }}
        >
          WebCrawler
        </h1>
        <p className="text-sm mb-8" style={{ color: '#64748B' }}>
          Audit any website. Analyze structure, broken links, and page performance.
        </p>

        <CrawlInput onSubmit={handleSubmit} loading={loading} error={error} />

        <div className="mt-8 grid grid-cols-2 gap-2 text-left">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md"
              style={{ backgroundColor: '#1B2336', border: '1px solid #2D3A52' }}
            >
              <span style={{ color: '#475569' }}>{f.icon}</span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
